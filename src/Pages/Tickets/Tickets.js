import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import PrismCode from "../../component/TextEditor/PrismCode";
import Messages from "../Comments/CommentEditor";
import UserTags from "../../component/TextEditor/UserTags";
import CommentSection from "../Comments/CommentSection";
import debounce from 'lodash.debounce';
import "./Tickets.css";
import AOS from "aos";
// const CommentSection = React.lazy(() => import('../Comments/CommentSection'));
const MemoizedUserTags = React.memo(UserTags);


const Tickets = () => {
  const { id } = useParams();
  const [currentTicket, setCurrentTicket] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentCode, setCommentCode] = useState(null);
  const [commentLang, setCommentLang] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [commentType, setCommentType] = useState('');
  const [commentSectionKey, setCommentSectionKey] = useState(Date.now());



  const createStars = useMemo(() => {
    return (level) => {
      const stars = [];
      for (let i = 0; i < level; i++) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.950l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.950l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        );
      }
      return stars;
    };
  }, []);

  const handleToggleMessages = () => {
    console.log(commentType)
    setShowMessages((prevState) => !prevState);

  };

  const handleExpandClick = debounce((comment) => {
    setCommentCode(comment.code);
    setCommentLang(comment.language);
    console.log("comment id:", comment.id);
  }, 250);

  const fetchUserData = async (uid) => {
    if (!uid) {
      return null;
    }

    const db = getFirestore();
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    return userDocSnapshot.exists() ? userDocSnapshot.data() : null;
  };
  const handleCommentAdded = () => {
    setCommentSectionKey(Date.now());
  };
  const fetchTicket = async () => {
    if (!id) {
      console.log("id nno especificado");
      return;
    }

    const db = getFirestore();
    const ticketDocRef = doc(db, "ticket", id);
    const ticketSnapshot = await getDoc(ticketDocRef);

    if (ticketSnapshot.exists()) {
      const ticketData = ticketSnapshot.data();
      console.log(ticketSnapshot.id)
      setTicketId(ticketSnapshot.id)
      const userData = await fetchUserData(ticketData.uid);
      setCurrentTicket({ ...ticketData, id: ticketSnapshot.id, userData });
      setLoading(false);
    } else {
      console.log("Ticket no encontrado");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    AOS.init();

  }, [id]);

  return (
    <section id="main" className="d-flex flex-column justify-content-center">
      <div className="post-background">
        {loading ? (
          <p>Cargando...</p>
        ) : currentTicket ? (
          <div className="container row ticket-post">
            <div className="offset-1 col-md-2 col-12 content-body">
              <div className="content user-box">
                <div className="meta">
                  <p id="username">
                    {currentTicket.userData?.username || "Desconocido"}
                  </p>
                  <p id="user-title">s
                    {currentTicket.userData?.profession || "Desconocido"}
                  </p>
                  <div className="skill-container">
                    {(currentTicket.userData?.skills || []).map((skill, index) => (
                      <div className="skill" key={index}>
                        <p className="skill-name">{skill.name}</p>
                        <div className="stars">{createStars(skill.rating)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-12 content-body">
              <div className="content post-box">
                <div className="meta">
                  <div className="fecha">
                    {currentTicket.createdAt?.toDate().toLocaleString()}
                  </div>
                  <h2>{currentTicket.title || "sin título"}</h2>
                  <div className="ticket-type">
                    <p>{currentTicket.type || "Otro"}</p>
                  </div>
                  <div className="post-text">
                    {currentTicket.text ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentTicket.text,
                        }}
                      />
                    ) : (
                      "..."
                    )}
                    <MemoizedUserTags tags={currentTicket.tags || []} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-12 sidebar">
              <PrismCode
                code={currentTicket.code || ""}
                language={currentTicket.language || "javascript"}
              />
            </div>
            <div className="reply-container">
              <button
                className="reply-btn custom-btn btn-4"
                onClick={() => {
                  handleToggleMessages();
                  setCommentType('main')
                }}

              >
                <span className="btn-text">Comentar</span>
              </button>
            </div>

            {showMessages && (
              <Messages
                codeContent={`// ${currentTicket.language}\n${currentTicket.code}`}
                codeLanguage={currentTicket.language}
                ticketId={ticketId}
                commentType={commentType}
                onCommentAdded={handleCommentAdded}
              />
            )}
          </div>
        ) : (
          <p>Vacío</p>
        )}
        <div className="container row ticket-post">
          <div className="offset-1 col-md-6 col-12 comm-section">
            <CommentSection
              key={commentSectionKey}
              ticketId={ticketId}
              onExpandClick={handleExpandClick}
              onToggleMessages={handleToggleMessages} />
          </div>
          <div className=" col-md-5 col-12 sidebar">
            <PrismCode
              code={commentCode || ""}
              language={commentLang || "javascript"}
            />
          </div>
        </div>


      </div>
    </section>
  );
};

export default Tickets;
