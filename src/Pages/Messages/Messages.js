import React, { useEffect, useState } from "react";
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./Messages.css";
import AOS from "aos";
import "aos/dist/aos.css";
import TextEditor from "../../component/TextEditor/TextEditor";
import CodeEditor from "../../component/TextEditor/CodeEditor";
import TagContainer from "../../component/TextEditor/TagContainer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [editorContent, setEditorContent] = useState("");
  const [aceEditorContent, setAceEditorContent] = useState("");
  const [ticketType, setTicketType] = useState("ticket");
  const [ticketTitle, setTicketTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [autoCloseDuration, setAutoCloseDuration] = useState("none");
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const db = getFirestore();

  const handleAutoCloseDurationSelect = (duration) => {
    setAutoCloseDuration(duration);
  };

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const handleAceEditorChange = (newContent) => {
    setAceEditorContent(newContent);
  };
  const handleLanguageChange = (language) => { // Update the selected language
    setSelectedLanguage(language);
  };

  const handleTagsChange = (updatedTags) => { // Update selected tags
    setSelectedTags(updatedTags);
  };


  const handleTitleChange = (event) => {
    setTicketTitle(event.target.value); // Update ticket title
  };


  const handleSaveClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const autoCloseTimestamp = calculateAutoCloseTimestamp(autoCloseDuration);

    const newTicket = {
      title: ticketTitle,
      type: ticketType,
      text: editorContent,
      code: aceEditorContent,
      tags: selectedTags,
      language: selectedLanguage,
      createdAt: new Date(),
      uid: user.uid,
      autoCloseAt: autoCloseTimestamp,
      estado: "abierto"
    };

    try {
      await addDoc(collection(db, "ticket"), newTicket);
      console.log("ticket creado.");
      MySwal.fire({
        text: `Ticket creado`,
        icon: "success",
        confirmButtonText: "Entendido",
      }).then(() => {
        navigate("/myTickets");
      });
    } catch (error) {
      console.error("c murio:", error);
    }
  };

  const handleTicketTypeSelect = (selectedType) => {
    setTicketType(selectedType);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const handleTabClick = (targetId) => {
    setActiveTab(targetId);
  };

  const calculateAutoCloseTimestamp = (duration) => {
    if (duration === "none") {
      return null;
    } else {
      const now = new Date();
      let autoCloseTimestamp = new Date(now);

      if (duration === "1_day") {
        autoCloseTimestamp.setDate(now.getDate() + 1);
      } else if (duration === "3_days") {
        autoCloseTimestamp.setDate(now.getDate() + 3);
      } else if (duration === "1_week") {
        autoCloseTimestamp.setDate(now.getDate() + 7);
      } else if (duration === "1_month") {
        autoCloseTimestamp.setMonth(now.getMonth() + 1);
      }

      return autoCloseTimestamp;
    }
  };


  return (
    <section id="main" className="d-flex flex-column justify-content-center">
      <div
        className="container row"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
        style={{ position: "relative" }}
      >
        <div className="main-frame">
          <span className="line">
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
          </span>

          <div className="main-box">
            <div className="window-container wea">
              <div>
                <span id="usuario-name" style={{ color: 'white' }}>Crear Ticket</span>
                <input
                  type="text"
                  id="ticket-title"
                  placeholder="Escribe un título..."
                  value={ticketTitle}
                  onChange={handleTitleChange}
                />
                <DropdownButton
                  className="box-ticket-select"
                  as={ButtonGroup}
                  title={`Tipo de Ticket: ${ticketType}`}
                  onSelect={handleTicketTypeSelect}
                  id="ticket-type-dropdown"
                  style={{ minWidth: "12vw" }}
                >
                  <Dropdown.Item eventKey="Ticket">Ticket</Dropdown.Item>
                  <Dropdown.Item eventKey="Error">Error</Dropdown.Item>
                  <Dropdown.Item eventKey="Consulta">Consulta</Dropdown.Item>
                </DropdownButton>
                <DropdownButton
                  className="box-ticket-select"
                  as={ButtonGroup}
                  title={`Fecha límite: ${autoCloseDuration}`}
                  onSelect={handleAutoCloseDurationSelect}
                  id="auto-close-dropdown"
                  style={{ minWidth: "12vw" }}
                >
                  <Dropdown.Item eventKey="none">...</Dropdown.Item>
                  <Dropdown.Item eventKey="1_day">1 dia</Dropdown.Item>
                  <Dropdown.Item eventKey="3_days">3 dias</Dropdown.Item>
                  <Dropdown.Item eventKey="1_week">1 semana</Dropdown.Item>
                </DropdownButton>
              </div>

              <div className="opt-container">
                <div className="foo">
                  <div
                    className="foo-inner preview"
                    id="save"
                    onClick={handleSaveClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                      <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* CARGA MASIVA DE CONTENIDO DESDE ESTRUCTURA.JSON */}

              {/* <div className="foo"> <BulkLoad /> </div> */}

              {/* CARGA MASIVA DE CONTENIDO DESDE ESTRUCTURA.JSON */}


            </div>

            <div className="ticket-box">
              <div className="tab-container">
                <div
                  className={`tab ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => handleTabClick("info")}
                >
                  Contenido
                </div>
                <div
                  className={`tab ${activeTab === "exp" ? "active" : ""}`}
                  onClick={() => handleTabClick("exp")}
                >
                  Código
                </div>

              </div>

              <div
                className={`ticket-item ${activeTab === "info" ? "active" : ""
                  }`}
                id="info"
                data-aos="fade-right"
              >
                <div className="row">
                  <div className="details">
                    <div className="row">
                      <div className="offset-1 col-7" id="text-editor">
                        <div>
                          <TextEditor
                            content={editorContent}
                            onEditorChange={handleEditorChange}
                          />
                          <TagContainer onTagsChange={handleTagsChange} />

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`ticket-item ${activeTab === "exp" ? "active" : ""}`}
                id="exp"
                data-aos="fade-right"
              >
                <div className="row">
                  <div className="details">
                    <div className="row">
                      <div className="offset-1 col-7" id="text-editor">
                        <CodeEditor
                          content={aceEditorContent}
                          onEditorChange={handleAceEditorChange}
                          onLanguageChange={handleLanguageChange}
                        />
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`ticket-item ${activeTab === "tags" ? "active" : ""
                  }`}
                id="tags"
                data-aos="fade-right"
              >
                <div className="details">
                  <div className="row">
                    <div className="offset-1 col-7" id="text-editor">
                      {/* Additional content or tags */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;

