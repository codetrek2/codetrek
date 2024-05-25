import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const LanguageDropdown = ({ onSelect }) => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      const db = getFirestore();
      const languagesCollection = collection(db, 'tags');
      const querySnapshot = await getDocs(languagesCollection);

      const languagesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setLanguages(languagesList);
    };

    fetchLanguages();
  }, []);

  const handleSelect = (key) => {
    setSelectedLanguage(key);
    if (onSelect) {
      onSelect(key);
    }
  };

  return (
    <div className="ace-select tag-select">
      <DropdownButton
        as={ButtonGroup}
        title={`Filtrar por tag: ${selectedLanguage || ''}`}
        onSelect={handleSelect}
        id="language-dropdown"
      >
        {languages.map((language) => (
          <Dropdown.Item key={language.id} eventKey={language.name}>
            {language.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default LanguageDropdown;
