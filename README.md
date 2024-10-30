# context-lift

🚀 Intelligently consolidate your project files for better AI context sharing.

## Why context-lift?

When working with AI models like Claude, you often need to provide context from multiple files across your project. `context-lift` makes this easy by:

- 📂 Consolidating files from nested directories into a single location
- 🚫 Excluding unnecessary files and directories (like node_modules)
- 🎯 Filtering by file extensions
- 🔄 Handling file name conflicts automatically

## Installation

```bash
npm install -g context-lift
```

## Usage

Basic usage:
```bash
context-lift
```

This will consolidate files from the current directory into a new `context-output` directory.

### Advanced Usage

```bash
# Specify source and target directories
context-lift --source ./my-project --target ./ai-context

# Exclude specific directories
context-lift --exclude-dirs node_modules .git dist

# Exclude file patterns
context-lift --exclude-files "*.log" ".env" "*.tmp"

# Include only specific file extensions
context-lift --include-extensions .js .ts .json
```

### All Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| --source | -s | Source directory | Current directory |
| --target | -t | Target directory | ./context-output |
| --exclude-dirs | -d | Directories to exclude | ['node_modules', '.git', 'dist', 'build'] |
| --exclude-files | -f | File patterns to exclude | ['*.log', '.env', '*.tmp'] |
| --include-extensions | -e | File extensions to include | null (all files) |

## Examples

1. Basic consolidation:
```bash
context-lift
```

2. Project-specific consolidation:
```bash
context-lift -s ./my-project -t ./ai-context -e .js .ts .jsx .tsx
```

3. Custom exclusions:
```bash
context-lift -d node_modules coverage -f "*.test.js" "*.spec.js"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT