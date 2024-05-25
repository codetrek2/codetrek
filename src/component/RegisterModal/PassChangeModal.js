import React, { useState } from 'react';
import './PassChangeModal.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const PassChangeModal = ({ show, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    

    const reauthenticate = (currentPassword) => {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      return reauthenticateWithCredential(user, credential);
    };

    if (newPassword === confirmPassword) {
      reauthenticate(currentPassword)
        .then(() => updatePassword(user, newPassword))
        .then(() => {
          alert("Contraseña cambiada con éxito");
          handleClose(); 
        })
        .catch((error) => {
          alert(`Error al cambiar la contraseña: ${error.message}`);
        });
    } else {
      alert("Las contraseñas no coinciden");
    }
  };

  return (
    
    <Modal className="pass-modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Contraseña Actual</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleChangePassword}>Cambiar Contraseña</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PassChangeModal;
