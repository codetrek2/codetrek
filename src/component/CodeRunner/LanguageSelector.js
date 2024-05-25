import React from 'react';
import { LANGUAGE_VERSIONS } from './constants';
import './coderunner.css'; // Importing the CSS file

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectLanguage = (lang) => {
    onSelect(lang);
    setIsMenuOpen(false);
  };

  return (
    <>
      <button className="button lang-select" onClick={toggleMenu}>
        {language}
      </button>
      {isMenuOpen && (
        <div className="menu">
          {languages.map(([lang, version]) => (
            <div
              key={lang}
              className="menu-item"
              style={{
                background: lang === language ? '#333' : 'transparent',
              }}
              onClick={() => selectLanguage(lang)}
            >
              {lang} &nbsp;
              <span style={{ color: 'gray', fontSize: 'small' }}>
                ({version})
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
  
};

export default LanguageSelector;
