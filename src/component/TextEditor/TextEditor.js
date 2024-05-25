import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function TextEditor({ content, onEditorChange }) {
  return (
    <Editor
      value={content}  
      onEditorChange={onEditorChange}
      init={{
        height: 300,
        menubar: false,
        plugins: "codesample",
        toolbar: "undo redo | formatselect | bold italic backcolor | fontsize | codesample",
        license_key: 'gpl',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px ;background:transparent; color:white}',

      }}
    />
  );
}

export default TextEditor;

