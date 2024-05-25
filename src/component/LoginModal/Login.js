import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './Login.css';

const MySwal = withReactContent(Swal);

const Login = ({ closeModalLogin, openModalRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      MySwal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      closeModalLogin();
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error.message);
      setLoading(false);
      MySwal.fire({
        title: 'Error de inicio de sesión',
        text: 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  return (
    <Modal show onHide={closeModalLogin}>
      <Modal.Header closeButton>
        <Modal.Title>Inicio de sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleLogin}>
          <div className="mb-3 mt-4">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Correo electrónico"
            />
          </div>

          <div className="mb-3 mt-4">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Contraseña"
            />
          </div>

          <button type="submit" className="custom-btn btn-4" disabled={loading}>
            {loading ? 'Cargando...' : 'Enviar'}
          </button>
        </form>

        <p className="mt-4">
          ¿No tienes cuenta? <br />
          <span id="signin" onClick={openModalRegister} style={{ cursor: 'pointer' }}>
            Regístrate
          </span>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
