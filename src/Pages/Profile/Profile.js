import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Firebase Firestore
import "./Profile.css";
import AOS from "aos";
import "aos/dist/aos.css";
import PassChangeModal from "../../component/RegisterModal/PassChangeModal";
import UpdateInfoModal from "../../component/ProfileModals/UpdateInfoModal";

const MySwal = withReactContent(Swal);

const createStars = (level) => {
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
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>
    );
  }
  return stars;
};

AOS.init();

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [showModal, setShowModal] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    profession: "",
    email: "",
    redes: [],
    skills: [],
  });
  const navigate = useNavigate();

  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [redes, setRedes] = useState([]);
  const handleTabClick = (target) => {
    setActiveTab(target);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const fetchUserData = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserData({
          name: data.username || "",
          profession: data.profession || "",
          email: data.email || "",
          redes: data.redes || [],
          skills: data.skills || [],
        });
      } else {
        console.error("Document not found!");
      }
    }
  };

  const fetchUserTickets = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No authenticated user found");
      return;
    }

    const ticketsQuery = query(
      collection(db, "ticket"),
      where("uid", "==", currentUser.uid)
    );

    const ticketDocs = await getDocs(ticketsQuery);

    const ticketsWithComments = await Promise.all(
      ticketDocs.docs.map(async (ticketDoc) => {
        const ticketId = ticketDoc.id;
        const commentQuery = query(
          collection(db, "comment"),
          where("ticketId", "==", ticketId)
        );

        const commentSnapshot = await getDocs(commentQuery);

        return {
          ...ticketDoc.data(),
          id: ticketId,
          commentCount: commentSnapshot.size,
        };
      })
    );

    setUserTickets(ticketsWithComments);
  };

  const updateTicketState = async (ticketId, newState) => {
    const db = getFirestore();
    const ticketDocRef = doc(db, "ticket", ticketId);

    try {
      await updateDoc(ticketDocRef, { estado: newState });
      MySwal.fire({
        text: `Nuevo estado del ticket: ${newState}`,
        icon: "success",
      });
      console.log(`nueo estado ${newState}`);

      fetchUserTickets();
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: `Error al cambiar el estado`,
        icon: "error",
      });
      console.error(`aaaaaaaaa ${ticketId}:`, error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserTickets();
  }, []);
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
            <div className="window-container profile">
              <p>
                <span id="usuario-name">{userData.name || "..."}</span>
                <span id="usuario-title">{userData.profession || "..."}</span>
              </p>
            </div>

            <div className="tab-container">
              <div
                className={`tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => handleTabClick("info")}
              >
                Información
              </div>
              <div
                className={`tab ${activeTab === "exp" ? "active" : ""}`}
                onClick={() => handleTabClick("exp")}
              >
                Habilidades
              </div>
              <div
                className={`tab ${activeTab === "tags" ? "active" : ""}`}
                onClick={() => handleTabClick("tags")}
              >
                Mis Tickets
              </div>
            </div>

            <div className="profile-box">
              <div
                className={`profile-item ${activeTab === "info" ? "active" : ""
                  }`}
                id="info"
                data-aos="fade-right"
              >
                <div className="row">
                  <div className="details">
                    <div className="row">
                      <div className="col-4">
                        <h4>Datos:</h4>
                        <p>
                          <span style={{ color: "#00aaff" }}>Nombre:</span>{" "}
                          {userData.name}
                        </p>
                        <p>
                          <span style={{ color: "#00aaff" }}>Profesión:</span>{" "}
                          {userData.profession}
                        </p>
                        <p>
                          <span style={{ color: "#00aaff" }}>Correo:</span>{" "}
                          {userData.email}
                        </p>
                        <button
                          id="btn-edit"
                          onClick={() => setShowModal(true)}
                        >
                          Cambiar Contraseña
                        </button>
                      </div>
                      <div className="col-6">
                        <h4>Redes:</h4>
                        {(userData.redes || []).map((red, index) => (
                          <p key={index}>
                            <span style={{ color: "#00aaff" }}>
                              {red.type}:
                            </span>{" "}
                            {red.url}
                          </p>
                        ))}
                        <button
                          id="btn-edit"
                          onClick={() => setShowUpdateInfoModal(true)}
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`profile-item ${activeTab === "exp" ? "active" : ""
                  }`}
                id="exp"
                data-aos="fade-right"
              >
                <div className="row">
                  <div className="details">
                    <div className="row">
                      <div
                        className="col-6"
                        style={{ maxHeight: "13vw", overflowY: "scroll" }}
                      >
                        {(userData.skills || []).map((skill, index) => (
                          <div className="exp-line" key={index}>
                            <h4>{skill.name}</h4>
                            <div className="stars">
                              {createStars(skill.rating)}
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                      {/* <div className="col-3" style={{ padding: "0 5vw" }}>
                        <button id="btn-edit">Actualizar info</button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`profile-item ${activeTab === "tags" ? "active" : ""
                  }`}
                id="tags"
                data-aos="fade-right"
              >
                <div className="row">
                  <div className="details">
                    <div className="row">
                      <div className="col-md-8 col-12">
                        <div className="user-tickets">
                          {userTickets.map((ticket) => (
                            <div
                              className="ticket-record"
                              key={ticket.id}
                              onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >
                              <span>
                                {" "}
                                <h4>{ticket.title}</h4>
                                <p>Comentarios: {ticket.commentCount}</p>
                                <p>Estado: {ticket.estado}</p>
                              </span>
                              <div className="ticket-options">
                                <div
                                  className="open-ticket"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTicketState(ticket.id, "abierto");
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-check"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                  </svg>
                                </div>
                                <div
                                  className="close-ticket"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTicketState(ticket.id, "cerrado");
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-x"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                  </svg>
                                </div>
                                <div
                                  className="pause-ticket"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTicketState(ticket.id, "pausa");
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pause"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* <div className="col-3" style={{ padding: "0 5vw" }}>
                        <button id="btn-edit">Actualizar info</button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <PassChangeModal show={showModal} handleClose={handleModalClose} />
            <UpdateInfoModal
              show={showUpdateInfoModal}
              handleClose={() => setShowUpdateInfoModal(false)}
              initialRedes={userData.redes}
              initialSkills={userData.skills}
              initialProfession={userData.profession}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
