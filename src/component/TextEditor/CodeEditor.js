import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-vbscript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-swift';
import 'ace-builds/src-noconflict/mode-php_laravel_blade';
import 'ace-builds/src-noconflict/mode-plsql';
import 'ace-builds/src-noconflict/mode-razor';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-sass';
import 'ace-builds/src-noconflict/mode-sqlserver';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-vue';
import 'ace-builds/src-noconflict/mode-cobol';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';

const MyCodeEditor = ({ content, onEditorChange, onLanguageChange }) => {
  const [selectedMode, setSelectedMode] = useState('javascript');
  const [selectedTheme, setSelectedTheme] = useState('solarized_dark');

  const handleLanguageSelect = (key) => {
    setSelectedMode(key);
    if (onLanguageChange) {
      onLanguageChange(key);
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'vbscript', label: 'VBScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'json', label: 'JSON' },
    { value: 'swift', label: 'Swift' },
    { value: 'php_laravel_blade', label: 'PHP Laravel Blade' },
    { value: 'plsql', label: 'PL/SQL' },
    { value: 'razor', label: 'Razor' },
    { value: 'rust', label: 'Rust' },
    { value: 'sass', label: 'Sass' },
    { value: 'sqlserver', label: 'SQL Server' },
    { value: 'xml', label: 'XML' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'cobol', label: 'Cobol' },
  ];

  const themeOptions = [
    { value: 'monokai', label: 'Monokai' },
    { value: 'solarized_dark', label: 'Solarized Dark' },
    { value: 'solarized_light', label: 'Solarized Light' },
  ];

  return (
    <div className="ace-container">
      <div className="ace-select">
        <DropdownButton
          className="dropdown"
          as={ButtonGroup}
          title={`Lenguaje: ${languageOptions.find((opt) => opt.value === selectedMode).label}`}
          onSelect={handleLanguageSelect} // Call the handler
          id="language-dropdown"
        >
          {languageOptions.map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {option.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <DropdownButton className="dropdown"
          as={ButtonGroup}
          title={`Tema: ${themeOptions.find((opt) => opt.value === selectedTheme).label}`}
          onSelect={(key) => setSelectedTheme(key)}
          id="theme-dropdown"
        >
          {themeOptions.map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {option.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
      <AceEditor
        mode={selectedMode}
        theme={selectedTheme}
        name="my-code-editor"
        height="200px"
        width="100%"
        display="flex"
        flex="1 1"
        fontSize={14}
        setOptions={{ useWorker: false }}
        value={content}
        onChange={onEditorChange}
      />
    </div>
  );
};

export default MyCodeEditor;

