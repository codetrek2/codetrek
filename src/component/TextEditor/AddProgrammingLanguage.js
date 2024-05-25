import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { Button, Form, Alert } from 'react-bootstrap';

const AddProgrammingLanguage = () => {
  const [languageName, setLanguageName] = useState(''); 
  const [error, setError] = useState(null); 

  const handleAddLanguage = async () => {
    if (languageName.trim() === '') {
      setError('Please enter a programming language name.');
      return;
    }

    try {
      const db = getFirestore(); 
      const languagesCollection = collection(db, 'tags');

      await addDoc(languagesCollection, { name: languageName });

      setLanguageName('');
      setError(null);
      alert(`Programming language "${languageName}" added successfully.`);
    } catch (err) {
      console.error('Error adding programming language:', err);
      setError('An error occurred while adding the programming language.');
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>} 
      <Form>
        <Form.Group controlId="addLanguage">
          <Form.Label>Programming Language Name</Form.Label>
          <Form.Control
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddLanguage}> 
          Add Language
        </Button>
      </Form>
    </div>
  );
};

export default AddProgrammingLanguage;
