import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './Register.css';

const MySwal = withReactContent(Swal);

const Register = ({ openModalLogin, closeModalRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const db = getFirestore();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await signOut(auth);

      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email: user.email,
        username,
        phonenumber,
        uid: user.uid
      });

      MySwal.fire({
        title: 'Registro exitoso',
        text: `Se ha enviado un correo de verificación a ${user.email}. Por favor, verifica tu correo para activar tu cuenta.`,
        icon: 'success',
        confirmButtonText: 'Entendido',
      });

      closeModalRegister();
      // openModalLogin(); 
    } catch (error) {
      console.error(error);
      MySwal.fire({
        title: 'Error en el registro',
        text: 'Hubo un problema al crear el usuario, por favor verifica los campos e intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  return (
    <Modal show onHide={closeModalRegister}>
      <Modal.Header closeButton>
        <Modal.Title>Registro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Número de contacto</label>
            <input
              type="text"
              className="form-control"
              value={phonenumber}
              required
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="custom-btn btn-4">Enviar</button>
        </form>

        <p className="mt-4">
          ¿Ya tienes cuenta? <br />
          <a onClick={openModalLogin} style={{ cursor: 'pointer' }}>
            Inicia Sesión
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
