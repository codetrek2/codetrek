import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";

import "./Navbar.css";

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  const handleNavHover = (event) => {
    const navLink = event.target;
    const span = navLink.querySelector("span");
    if (span) {
      span.style.display = "inline";
    }
  };

  const handleNavLeave = (event) => {
    const navLink = event.target;
    const span = navLink.querySelector("span");
    if (span) {
      span.style.display = "none";
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error during logout");
    }
  };

  return (
    <>
      <header id="header" className="d-flex flex-column justify-content-center">
        <nav id="navbar" className="navbar nav-menu">
          <ul>
            <li>
              <Link to="/" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-home"></i> <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavLeave}
                className="nav-link"
              >
                <i className="bx bx-user"></i>
                <span>Perfil</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/tickets" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-file-blank"></i> <span>Tickets</span>
              </Link>
            </li> */}
            <li>
              <Link to="/myTickets" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-code-alt"></i> <span>Mis Tickets</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-edit-alt"></i> <span>Crear Ticket</span>
              </Link>
            </li>
            <li>
              <Link to="/posts" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-conversation"></i> <span>Tickets</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/contact" onMouseEnter={handleNavHover} onMouseLeave={handleNavLeave} className="nav-link" >
                <i className="bx bx-envelope"></i> <span>Contacto</span>
              </Link>
            </li> */}

            {currentUser && (
              <li>
                <Link
                  to="#"
                  onMouseEnter={handleNavHover}
                  onMouseLeave={handleNavLeave}
                  onClick={handleLogout}
                  className="nav-link"
                >
                  <i className="bx bx-log-out"></i> <span>Logout</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
