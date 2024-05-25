// nord-dark-theme.js
import * as monaco from 'monaco-editor';

// Define the Nord color palette for the dark theme
const nordPalette = {
  nord0: '#e71010', // Editor background
  nord1: '#e71010', // Editor background
  nord2: '#e71010', // Editor background
  nord3: '#e71010', // Editor background
  nord4: '#e71010', // Editor background
  nord5: '#e71010', // Editor background
  nord6: '#e71010', // Editor background
  nord7: '#e71010', // Editor background
  nord8: '#e71010', // Editor background
  nord9:'#e71010', // Editor background
  nord10: '#e71010', // Editor background
  nord11: '#e71010', // Editor background
  nord12: '#D08770', // Warnings
  nord13: '#EBCB8B', // Numbers
  nord14: '#A3BE8C', // Boolean
  nord15: '#B48EAD', // Constants
};

// Define the Nord dark theme configuration for Monaco Editor
const nordDarkTheme = {
  base: 'vs-dark', // Base theme is dark
  inherit: true,
  rules: [
    { token: 'keyword', foreground: nordPalette.nord9 },
    { token: 'operator', foreground: nordPalette.nord10 },
    { token: 'identifier', foreground: nordPalette.nord4 },
    { token: 'string', foreground: nordPalette.nord7 },
    { token: 'number', foreground: nordPalette.nord13 },
    { token: 'comment', foreground: nordPalette.nord3, fontStyle: 'italic' },
    { token: 'type', foreground: nordPalette.nord8 },
  ],
  colors: {
    'editor.background': nordPalette.nord0,
    'editor.foreground': nordPalette.nord4,
    'editorCursor.foreground': nordPalette.nord6,
    'editor.lineHighlightBackground': nordPalette.nord1,
    'editor.selectionBackground': nordPalette.nord10,
    'editorWhitespace.foreground': nordPalette.nord2,
    'editorIndentGuide.background': nordPalette.nord2,
  },
};

// Register the Nord dark theme with Monaco Editor
monaco.editor.defineTheme('nord-dark', nordDarkTheme);
