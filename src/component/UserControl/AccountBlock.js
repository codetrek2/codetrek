import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import "./controlBlock.css";
import { login, register } from "./UserAuth";
import { getAuth } from "firebase/auth";

const MySwal = withReactContent(Swal);

const AccountBlock = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for visibility toggle

  const togglePasswordVisibility = () => {
    // Toggle the boolean value of isPasswordVisible
    setIsPasswordVisible((prev) => !prev);
  };

  const [activeForm, setActiveForm] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setregisterEmail] = useState("");
  const [registerPassword, setregisterPassword] = useState("");
  const [registerPassword2, setregisterPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (formName) => {
    setActiveForm(formName);
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      MySwal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos.",
        icon: "warning",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      MySwal.fire({
        title: "Error de inicio de sesión",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let swalResponse = "";
    if (!registerEmail || !registerPassword || !registerPassword2) {
      swalResponse = "Campos vacíos";
    } else if (registerPassword !== registerPassword2) {
      swalResponse = "Las contraseñas no coinciden";
    }

    if (swalResponse) {
      MySwal.fire({
        title: "Oops",
        text: swalResponse,
        icon: "warning",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    setLoading(true);

    try {
      await register(registerEmail, registerPassword);
      setLoading(false);
      MySwal.fire({
        title: "Registro exitoso",
        text: `El usuario ${registerEmail} ha sido creado con éxito.`,
        icon: "success",
        confirmButtonText: "Entendido",
      }).then(() => {
        const auth = getAuth();
        auth.signOut(); // Sign out after registration
        navigate("/"); // Redirect to the login page
      });
    } catch (error) {
      setLoading(false);
      MySwal.fire({
        title: "Error en el registro",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  return (
    <section className="forms-section">
      {loading && (
        <span className="auth-spinner">
          {" "}
          <div className="loader">
            <span>&#123;</span>
            <span>&#125;</span>
          </div>
        </span>
      )}
      <div className="btn-container">
        <button
          type="button"
          className="switcher switcher-login"
          onClick={() => handleSwitch("login")}
        >
          {" "}
          Login <span className="underline"></span>{" "}
        </button>
        <button
          type="button"
          className="switcher switcher-signup"
          onClick={() => handleSwitch("signup")}
        >
          {" "}
          Sign Up <span className="underline"></span>{" "}
        </button>
      </div>
      <div className="forms">
        <div
          className={`form-wrapper ${activeForm === "login" ? "is-active" : ""
            }`}
        >
          <form className="form form-login" onSubmit={handleLogin}>
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-block pass-block">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {isPasswordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-eye-slash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-eye"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="custom-btn btn-4"
                disabled={loading}
              >
                {" "}
                {loading ? "Cargando..." : "Enviar"}{" "}
              </button>
              {/* <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Cargando..." : "Enviar"}
            </button> */}
            </fieldset>
          </form>
        </div>
        <div
          className={`form-wrapper ${activeForm === "signup" ? "is-active" : ""
            }`}
        >
          <form className="form form-signup" onSubmit={handleRegister}>
            <fieldset>
              <legend>
                Please, enter your email, password, and password confirmation
                for sign up.
              </legend>
              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setregisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-block pass-block">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setregisterPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {isPasswordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-eye-slash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-eye"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="input-block">
                <label htmlFor="signup-password-confirm">
                  Confirm password
                </label>
                <input
                  id="signup-password-confirm"
                  type={isPasswordVisible ? "text" : "password"}
                  value={registerPassword2}
                  onChange={(e) => setregisterPassword2(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="custom-btn btn-4"
                disabled={loading}
              >
                {" "}
                {loading ? "Cargando..." : <span>test</span>}{" "}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AccountBlock;
