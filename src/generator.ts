import { TreeNode, GenerateOptions, Theme } from './types.js';
import { getTheme } from './themes.js';

interface LayoutNode {
  node: TreeNode;
  x: number;
  y: number;
  width: number;
  depth: number;
  centerX: number;
  centerY: number;
}

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type: 'horizontal' | 'vertical';
}

interface TreeBounds {
  width: number;
  height: number;
}

export function generateTreeSVG(tree: TreeNode, options: GenerateOptions = {}): string {
  const {
    theme = 'github-dark',
    title = 'Folder Structure',
    showTitle = true,
    width = 1200,
    nodeHeight = 38,
    verticalSpacing = 16,
    horizontalSpacing = 180,
  } = options;

  const themeColors = getTheme(theme);
  const layouts: LayoutNode[] = [];
  const connections: Connection[] = [];

  // Calculate layout positions
  const startY = showTitle ? 160 : 80;
  const startX = 90;

  function layoutTree(node: TreeNode, x: number, y: number, depth: number): number {
    const textWidth = measureText(node.name);
    const nodeWidth = Math.max(textWidth + 42, 90);
    const centerX = x + nodeWidth / 2;
    const centerY = y;

    layouts.push({ node, x, y, width: nodeWidth, depth, centerX, centerY });

    if (!node.children || node.children.length === 0) {
      return y + nodeHeight + verticalSpacing;
    }

    const childX = x + horizontalSpacing;
    let childY = y;

    // Layout all children
    node.children.forEach((child, index) => {
      if (index > 0) {
        childY += verticalSpacing;
      }
      childY = layoutTree(child, childX, childY, depth + 1);
    });

    return childY;
  }

  const maxY = layoutTree(tree, startX, startY, 0);
  
  // Now create connections based on final positions
  const nodeMap = new Map<TreeNode, LayoutNode>();
  layouts.forEach(layout => nodeMap.set(layout.node, layout));

  layouts.forEach(layout => {
    if (layout.node.children && layout.node.children.length > 0) {
      const parent = layout;
      const children = layout.node.children.map(c => nodeMap.get(c)!);
      
      // Horizontal line from parent to connection point
      const connectionX = parent.x + parent.width + 30;
      connections.push({
        from: { x: parent.x + parent.width, y: parent.centerY },
        to: { x: connectionX, y: parent.centerY },
        type: 'horizontal'
      });

      // Vertical line spanning all children
      if (children.length > 1) {
        const firstChild = children[0];
        const lastChild = children[children.length - 1];
        connections.push({
          from: { x: connectionX, y: firstChild.centerY },
          to: { x: connectionX, y: lastChild.centerY },
          type: 'vertical'
        });
      }

      // Horizontal lines to each child
      children.forEach(child => {
        connections.push({
          from: { x: connectionX, y: child.centerY },
          to: { x: child.x, y: child.centerY },
          type: 'horizontal'
        });
      });
    }
  });

  const height = maxY + 80;

  // Generate SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">Folder structure visualization</desc>
  <defs>
    <style>
      .card { fill: ${themeColors.cardBg}; stroke: ${themeColors.cardBorder}; stroke-width: 1; }
      .title { font: 700 32px ui-sans-serif, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; fill: ${themeColors.titleText}; }
      .label { font: 600 15px ui-sans-serif, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; fill: ${themeColors.text}; }
      .line { stroke: ${themeColors.line}; stroke-width: 2.5; stroke-linecap: round; fill: none; }
      .node-folder { fill: ${themeColors.folderBg}; stroke: ${themeColors.folderBorder}; stroke-width: 1.5; }
      .node-file { fill: ${themeColors.fileBg}; stroke: ${themeColors.fileBorder}; stroke-width: 1.5; }
      .dot { fill: ${themeColors.dot}; stroke: ${themeColors.dotStroke}; stroke-width: 1.5; }
      .node-folder, .node-file { filter: url(#nodeGlow); }
    </style>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="6" stdDeviation="16" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background card -->
  <rect class="card" x="28" y="28" width="${width - 56}" height="${height - 56}" rx="20" filter="url(#shadow)"/>
  ${showTitle ? `
  <!-- Title -->
  <text class="title" x="70" y="95">${escapeXml(title)}</text>` : ''}

  <!-- Connections -->
  <g>
${connections.map(conn => `    <path class="line" d="M${conn.from.x},${conn.from.y} L${conn.to.x},${conn.to.y}"/>`).join('\n')}
  </g>

  <!-- Nodes -->
  <g>
${layouts.map(layout => {
    const nodeClass = layout.node.type === 'folder' ? 'node-folder' : 'node-file';
    const icon = layout.node.type === 'folder' ? '📁' : '📄';
    
    return `    <g>
      <rect class="${nodeClass}" x="${layout.x}" y="${layout.y - nodeHeight / 2}" width="${layout.width}" height="${nodeHeight}" rx="10"/>
      <text class="label" x="${layout.x + 16}" y="${layout.y + 5}">${icon} ${escapeXml(layout.node.name)}</text>
    </g>`;
  }).join('\n')}
  </g>
</svg>`;
}

function measureText(text: string): number {
  // Rough estimation: 9px per character for the font we're using
  return text.length * 9;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
