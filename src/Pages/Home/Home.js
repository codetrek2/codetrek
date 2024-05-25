import React, { useEffect, useState, useContext, startTransition } from "react";
import "./Home.css";
import Typed from "typed.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";// Importa el componente Login
import Login from "../../component/LoginModal/Login";
import Register from "../../component/RegisterModal/Register";
import '../../component/LoginModal/Login.css';
import { AuthContext } from "../../component/Auth/AuthContext"; // Import AuthContext
import CodeRunner from "../../component/CodeRunner/CodeEditor";
import MinimalPosts from "../../component/PostsPage/MinimalPosts";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, } from "firebase/firestore";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenReg, setIsModalOpenReg] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loadingSelectedTicket, setLoadingSelectedTicket] = useState(false);

  const handleTicketClick = async (ticketId) => {
    setLoadingSelectedTicket(true);

    const db = getFirestore();
    const ticketRef = doc(db, "ticket", ticketId);

    // Wrap the asynchronous operation inside startTransition
    startTransition(() => {
      getDoc(ticketRef).then((ticketDoc) => {
        if (ticketDoc.exists()) {
          const ticketData = ticketDoc.data();
          setSelectedTicket({ id: ticketId, ...ticketData });
        } else {
          setSelectedTicket(null);
        }

        setLoadingSelectedTicket(false);
      }).catch((error) => {
        console.error("Error fetching ticket:", error);
        setLoadingSelectedTicket(false);
      });
    });
  };

  const openModalLogin = () => {
    setIsModalOpen(true);
  };

  const closeModalLogin = () => {
    setIsModalOpen(false);
  };

  const openModalRegister = () => {
    setIsModalOpenReg(true)
  }
  const closeModalRegister = () => {
    setIsModalOpenReg(false)
  }

  useEffect(() => {
    const options = {
      strings: [
        "React",
        "Ionic",
        "C++",
        "Laravel",
        ".NET",
        "PHP",
        "104 101 108 112",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    };

    const typed = new Typed(".typed", options);

    return () => {
      typed.destroy();
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: null,
    nextArrow: null,
    className: "swiper",
    appendDots: (dots) => (
      <div>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
  };

  const handleOverlayClick = (event) => {
    // Si se hace clic en la superposición del modal, ciérralo
    if (event.target.classList.contains("modal")) {
      closeModalLogin();
      closeModalRegister();
    }
  };

  return (
    <div>
      <section id="main" className="d-flex flex-column">
        <div
          className="container row"
          data-aos="zoom-in"
          data-aos-delay="100"
          style={{ position: "relative", marginLeft: "7vw" }}
        >
          <div className="col-md-6 col-lg-6 col-12" style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2vw" }} >
            <h1>
              CODE<b style={{ color: "#00aaff" }}>TREK</b>
            </h1>
            <p>
              <span className="typed"></span>
            </p>
            {!currentUser && (
              <div className="action-box">
                <div className="login-box"> <a id="login-btn" onClick={openModalLogin}> <span></span> <span></span> <span></span> <span></span>Ingresa </a> </div>
                <div className="login-box"> <a className="register-btn" onClick={openModalRegister}> <span></span> <span></span> <span></span> <span></span>Registrate </a> </div>
              </div>
            )}
          </div>
          <div
            className="col-md-6 col-lg-6 col-12"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <div className="box-featured">
              <CodeRunner />
            </div>
          </div>
        </div>
      </section>
      {/* <div className="container row postpage" style={{ position: "relative", maxHeight: "100%", paddingTop: "0" }}>
        <div className="col-md-6">
          <div className="single-clicked-post" style={{ marginTop: "7vw" }}>
            {loadingSelectedTicket ? (
              <p>Loading...</p>
            ) : selectedTicket ? (
              <div>

                <h3>{selectedTicket.title}</h3>
                <p>{selectedTicket.description}</p>
                <p>{selectedTicket.code}</p>
                <h4>Estado:</h4>
              </div>
            ) : (
              <p>No ticket selected</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <MinimalPosts onTicketClick={handleTicketClick} />
          </div>
        </div>
      </div> */}


      {isModalOpen && (
        <div className="modal" onClick={handleOverlayClick}>
          <div >
            <span className="close" onClick={closeModalLogin}>
              &times;
            </span>
            <Login openModalRegister={openModalRegister} closeModalLogin={closeModalLogin} />
          </div>
        </div>
      )}

      {isModalOpenReg && (
        <div className="modal" onClick={handleOverlayClick}>
          <div>
            <span className="close" onClick={closeModalRegister}>
              &times;
            </span>
            <Register openModalLogin={openModalLogin} closeModalRegister={closeModalRegister} />
          </div>
        </div>
      )}

      <div
        className="nav-mobile">
        {/* Contenido de la navegación móvil del HTML */}
      </div>
    </div>
  );
};

export default Home;

