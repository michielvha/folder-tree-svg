import { Theme } from './types.js';

export const GITHUB_DARK: Theme = {
  background: '#0d1117',
  cardBg: '#161b22',
  cardBorder: '#30363d',
  text: '#c9d1d9',
  textMuted: '#8b949e',
  folderBg: '#1f6feb',
  folderBorder: '#58a6ff',
  fileBg: '#238636',
  fileBorder: '#3fb950',
  line: '#30363d',
  dot: '#58a6ff',
  dotStroke: '#1f6feb',
  titleText: '#f0f6fc',
};

export const GITHUB_LIGHT: Theme = {
  background: '#ffffff',
  cardBg: '#f6f8fa',
  cardBorder: '#d0d7de',
  text: '#24292f',
  textMuted: '#57606a',
  folderBg: '#0969da',
  folderBorder: '#0969da',
  fileBg: '#1a7f37',
  fileBorder: '#1a7f37',
  line: '#d0d7de',
  dot: '#0969da',
  dotStroke: '#0969da',
  titleText: '#24292f',
};

export function getTheme(themeName: 'github-dark' | 'github-light'): Theme {
  return themeName === 'github-dark' ? GITHUB_DARK : GITHUB_LIGHT;
}
