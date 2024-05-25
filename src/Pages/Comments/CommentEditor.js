import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../Messages/Messages.css";
import "./CommentEditor.css";
import AOS from "aos";
import "aos/dist/aos.css";
import TextEditor from "../../component/TextEditor/TextEditor";
import CodeEditor from "../../component/TextEditor/CodeEditor";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);


const CommentEditor = ({ codeContent, codeLanguage, ticketId, commentType, onCommentAdded }) => {
  const [editorContent, setEditorContent] = useState("");
  const [aceEditorContent, setAceEditorContent] = useState(codeContent || "");

  const db = getFirestore();

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleAceEditorChange = (newContent) => {
    setAceEditorContent(newContent);
  };

  const handleSaveClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const newComment = {
      text: editorContent,
      code: aceEditorContent,
      language: codeLanguage,
      createdAt: new Date(),
      uid: user.uid,
    };

    if (commentType === 'main') {
      newComment.ticketId = ticketId;
      try {
        await addDoc(collection(db, "comment"), newComment);
        MySwal.fire({
          title: 'Listo',
          text: `Comentario creado`,
          icon: 'success',
          confirmButtonText: 'Entendido',
        });
        onCommentAdded();
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        await addDoc(collection(db, "comment", ticketId, "replies"), newComment);
        onCommentAdded();
      } catch (error) {
        console.error("Error creando respuesta:", error);
      }
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="container row comment-editor" style={{ position: "relative" }}>
      <div className="main-frame">
        <span className="comment-line"> </span>
        <div className="main-box">
          <div className="window-container wea">
            <p>
              <span id="usuario-name">Añadir Comentario</span>
            </p>
          </div>
          <div className="ticket-box">
            <div className="row">
              <div className="details">
                <div className="row ticket-comment">
                  <div className="col-5" id="text-editor">
                    <div className="text-editor-container">
                      <TextEditor
                        content={editorContent}
                        onEditorChange={handleEditorChange}
                      />
                    </div>
                  </div>
                  <div className="col-5" id="text-editor">
                    <CodeEditor
                      content={aceEditorContent ? aceEditorContent : codeContent}
                      onEditorChange={handleAceEditorChange}
                      onLanguageChange={codeLanguage}
                    />
                  </div>
                  <div className="col-1" id="text-editor">
                    <span className="send-btn" onClick={handleSaveClick}>
                      {">>"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentEditor;
