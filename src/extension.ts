// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const commandExecutor = (
  textEditor: vscode.TextEditor,
  mode: "restart" | "flat"
) => {
  if (textEditor.document.languageId === "markdown") {
    updateFile(textEditor, mode);
  }
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "markdown-auto-index" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let commandFlat = vscode.commands.registerTextEditorCommand(
    "markdown-auto-index.run-flat",
    (textEditor) => {
      commandExecutor(textEditor, "flat");
    }
  );

  let commandRestart = vscode.commands.registerTextEditorCommand(
    "markdown-auto-index.run-restart",
    (textEditor) => {
      commandExecutor(textEditor, "restart");
    }
  );

  context.subscriptions.push(commandFlat);
  context.subscriptions.push(commandRestart);
};

interface Line {
  value: string;
  eol: string;
}

const updateText = (input: string, restart?: boolean) => {
  const lines: Line[] = (input.match(/[^\n]*\n|[^\n]+/g) || [""]).map(
    (line) => {
      const value = line.replace(/\r?\n|\r/g, "");
      return { value, eol: line.substring(value.length) };
    }
  );

  const newLines: Line[] = [];

  const indexes = {
    /* eslint-disable @typescript-eslint/naming-convention -- We use the direct levels as property names */
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    /* eslint-enable @typescript-eslint/naming-convention */
  };

  const regex = /^(#{1,6}) [0-9]+\. (.*)/;

  lines.forEach((line, lineNumber) => {
    // if the line start with one to six # followed by numbers and a dot, this is an index that need to be update
    const result = regex.exec(line.value);
    if (result !== null) {
      const [, indexesText = "", lineText] = result;

      // count the number of #, that indicate the index level
      const indexLevel = indexesText.length;

      if (indexLevel >= 1 && indexLevel <= 6) {
        const index = indexes[indexLevel as keyof typeof indexes];

        // rewrite the line with the right index
        const newLine = `${indexesText} ${index}. ${lineText}`;
        newLines.push({ ...line, value: newLine });

        // increment the index table of the position
        indexes[indexLevel as keyof typeof indexes] += 1;

        // if in Restart mode, reset the lower indexes
        if (restart && indexLevel < 6) {
          for (let i = indexLevel + 1; i <= 6; i++) {
            indexes[i as keyof typeof indexes] = 1;
          }
        }

        return;
      }
    }

    newLines.push(line);
  });

  return newLines.reduce((acc, curr, index) => {
    // avoid adding the line break for the last line for range selections
    const eol = index === lines.length - 1 ? "" : curr.eol;

    return (acc += curr.value + eol);
  }, "");
};

const updateFile = (editor: vscode.TextEditor, mode: "restart" | "flat") => {
  const formattedDocument: string = updateText(
    editor.document.getText(),
    mode === "restart"
  );

  editor.edit((textEditorEdit) => {
    textEditorEdit.replace(
      new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(
          editor.document.lineCount - 1,
          Number.MAX_SAFE_INTEGER
        )
      ),
      formattedDocument
    );
  });
};

// This method is called when your extension is deactivated
export function deactivate() {}
