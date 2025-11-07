#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { generateTreeSVG } from './generator.js';
import { TreeNode } from './types.js';

function buildTreeFromPath(path: string, maxDepth: number = 5, currentDepth: number = 0): TreeNode {
  const stats = statSync(path);
  const name = path.split('/').pop() || path;

  if (!stats.isDirectory()) {
    return { name, type: 'file' };
  }

  if (currentDepth >= maxDepth) {
    return { name, type: 'folder', children: [] };
  }

  try {
    const items = readdirSync(path);
    const children = items
      .filter(item => !item.startsWith('.') && item !== 'node_modules')
      .map(item => buildTreeFromPath(join(path, item), maxDepth, currentDepth + 1))
      .sort((a, b) => {
        // Folders first, then files
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });

    return { name, type: 'folder', children };
  } catch (error) {
    return { name, type: 'folder', children: [] };
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options: any = {
    theme: 'github-dark',
    title: 'Folder Structure',
    showTitle: true,
    depth: 5,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
      case '-i':
        options.input = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--path':
      case '-p':
        options.path = args[++i];
        break;
      case '--title':
      case '-t':
        options.title = args[++i];
        break;
      case '--theme':
        options.theme = args[++i];
        break;
      case '--depth':
      case '-d':
        options.depth = parseInt(args[++i]);
        break;
      case '--no-title':
        options.showTitle = false;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      default:
        if (!args[i].startsWith('-')) {
          options.path = args[i];
        }
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Folder Tree SVG Generator

Usage:
  folder-tree-svg [options]

Options:
  -i, --input <file>     Input JSON file with tree structure
  -p, --path <dir>       Path to directory to scan
  -o, --output <file>    Output SVG file (default: tree.svg)
  -t, --title <text>     Title for the diagram
  --no-title             Hide the title header
  --theme <name>         Theme: github-dark (default) or github-light
  -d, --depth <number>   Maximum depth to scan (default: 5)
  -h, --help             Show this help

Examples:
  # Generate from a directory
  folder-tree-svg --path ./manifests --output tree.svg

  # Generate from JSON
  folder-tree-svg --input structure.json --output tree.svg

  # Custom title and theme
  folder-tree-svg --path ./src --title "Source Code" --theme github-light
`);
}

function main() {
  const options = parseArgs();

  if (!options.input && !options.path) {
    console.error('Error: Either --input or --path is required');
    showHelp();
    process.exit(1);
  }

  let tree: TreeNode;

  if (options.input) {
    const json = readFileSync(resolve(options.input), 'utf-8');
    tree = JSON.parse(json);
  } else {
    tree = buildTreeFromPath(resolve(options.path), options.depth);
  }

  const svg = generateTreeSVG(tree, {
    theme: options.theme,
    title: options.title,
    showTitle: options.showTitle,
  });

  const outputPath = options.output || 'tree.svg';
  writeFileSync(outputPath, svg, 'utf-8');

  console.log(`✨ Generated SVG: ${outputPath}`);
}

main();
