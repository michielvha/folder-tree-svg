#!/bin/bash

# Quick usage examples for folder-tree-svg

echo "📁 Folder Tree SVG - Quick Examples"
echo ""

# Example 1: Scan a folder
echo "1️⃣  Scan a real folder:"
echo "   node dist/cli.js --path ./your-folder --output tree.svg"
echo ""

# Example 2: From JSON
echo "2️⃣  Generate from JSON structure:"
echo "   node dist/cli.js --input structure.json --output tree.svg"
echo ""

# Example 3: Custom depth
echo "3️⃣  Limit depth to 2 levels:"
echo "   node dist/cli.js --path ./src --depth 2 --output tree.svg"
echo ""

# Example 4: Light theme
echo "4️⃣  Use light theme:"
echo "   node dist/cli.js --path ./src --theme github-light --output tree.svg"
echo ""

# Example 5: Custom title
echo "5️⃣  Custom title:"
echo "   node dist/cli.js --path ./manifests --title 'My Cool Project' --output tree.svg"
echo ""
