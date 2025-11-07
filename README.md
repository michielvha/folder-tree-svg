# Folder Tree SVG

Generate beautiful SVG visualizations of folder structures with GitHub dark theme - perfect for documentation!

## Features

- 🎨 Beautiful GitHub Dark theme (matches github-readme-stats style)
- 📁 Scan real directories or use JSON structure
- 🎯 Clean, hierarchical tree layout
- 💎 Customizable depth, title, and theme
- 📦 Zero dependencies in generated SVG

## Installation

```bash
npm install
npm run build
```

## Usage

### Scan a Real Folder

```bash
# Basic usage
node dist/cli.js --path ./manifests --output tree.svg

# With custom depth and title
node dist/cli.js --path ./src --depth 3 --title "Source Code" --output tree.svg

# Without title header (compact)
node dist/cli.js --path ./manifests --no-title --output tree.svg

# Light theme
node dist/cli.js --path ./docs --theme github-light --output tree.svg
```

### From JSON Structure

```bash
node dist/cli.js --input structure.json --output tree.svg
```

JSON format:
```json
{
  "name": "manifests",
  "type": "folder",
  "children": [
    {
      "name": "app1",
      "type": "folder",
      "children": [
        { "name": "kustomization.yaml", "type": "file" }
      ]
    }
  ]
}
```

## Options

```
  -p, --path <dir>       Path to directory to scan
  -i, --input <file>     Input JSON file with tree structure
  -o, --output <file>    Output SVG file (default: tree.svg)
  -t, --title <text>     Title for the diagram
  --no-title             Hide the title header (more compact)
  --theme <name>         Theme: github-dark (default) or github-light
  -d, --depth <number>   Maximum depth to scan (default: 5)
  -h, --help             Show help
```

## Use in Markdown

Once generated, use in your docs:

```markdown
![Folder Structure](./tree.svg)
```

Or inline:
```html
<img src="./tree.svg" alt="Folder Structure" />
```

## Examples

See `examples/` folder for generated SVGs:
- `kustomize-tree.svg` - JSON-based structure
- `real-folder-example.svg` - Scanned from actual folder

## TODO

- [ ] Add custom icons based on file extensions (e.g., TypeScript, JavaScript, YAML, JSON icons)

