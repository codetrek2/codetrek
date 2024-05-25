import React, { useState } from 'react';
import { executeCode } from './api';
import './coderunner.css'; // Importing the CSS file

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);

      setOutput(result.output.split('\n'));
      setIsError(!!result.stderr);

      if (result.stderr) {
        console.error(result.stderr);
      }
    } catch (error) {
      console.error(error);
      alert(`An error occurred: ${error.message || 'Unable to run code'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="exec-container">
          <button className="button btn-exec" disabled={isLoading} onClick={runCode} > {isLoading ? 'reza...' : 'Ejecutar'} </button>
          </div>
      <div className={`output-box ${isError ? 'error' : ''}`} >
        {output
          ? output.map((line, index) => (
            <div className="output-text" key={index}>{line}</div>
          ))
          : '.. escribe un código q devuelva los 10 primeros numeros de fibonacci'}
      </div>
    </>
  );
};

export default Output;
