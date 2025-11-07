export interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export interface Theme {
  background: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  folderBg: string;
  folderBorder: string;
  fileBg: string;
  fileBorder: string;
  line: string;
  dot: string;
  dotStroke: string;
  titleText: string;
}

export interface GenerateOptions {
  theme?: 'github-dark' | 'github-light';
  title?: string;
  showTitle?: boolean;
  width?: number;
  nodeHeight?: number;
  verticalSpacing?: number;
  horizontalSpacing?: number;
}
