# Markdown auto-indexes for Visual Studio Code

This extension for Visual Studio Code will parse Markdown files, and update all header indexes. It will not touch headers without index, nor numbered list

## Run
1. Show all commands
  - Windows/Unix: F1 or Ctrl + Shift + P
  - Mac: Ctrl + Cmd + P
2: Run `Markdown Auto Index: Run (Flat)` or `Markdown Auto Index: Run (Restart)`

## Modes
There is two modes : Flat or Restart
In `flat` mode, each index will follow the previous for the same level. In `restart`, the lower indexes will be reset when needed

### Examples

Base Markdown:
```md
# Title without index

# 1. Title with index 1
## Sub category
## 1. Indexed 1
## 1. Indexed 2
Text with ## .1 fake index
## 1. Indexed 3
## 1. Indexed 4
# 1. Title with index 2
## Sub category
## 1. Indexed 5
## 1. Indexed 6
## 15. Indexed 7 (long index)
## 1. Indexed 8
```

Using `flat` command:
```md
# Title without index

# 1. Title with index 1
## Sub category
## 1. Indexed 1
## 2. Indexed 2
Text with ## .1 fake index
## 3. Indexed 3
## 4. Indexed 4
# 1. Title with index 2
## Sub category
## 5. Indexed 5
## 6. Indexed 6
## 7. Indexed 7 (long index)
## 8. Indexed 8
```

Using `restart` command:
```md
# Title without index

# 1. Title with index 1
## Sub category
## 1. Indexed 1
## 2. Indexed 2
Text with ## .1 fake index
## 3. Indexed 3
## 4. Indexed 4
# 1. Title with index 2
## Sub category
## 1. Indexed 5
## 2. Indexed 6
## 3. Indexed 7 (long index)
## 4. Indexed 8
```