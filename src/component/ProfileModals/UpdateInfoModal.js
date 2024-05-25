import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import StarRating from "./StarRating";
import "./UpdateInfoModal.css";

const UpdateInfoModal = ({
  show,
  handleClose,
  initialProfession = "",
  initialRedes = [],
  initialSkills = [],
}) => {
  const [redes, setRedes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profession, setProfession] = useState("");
  useEffect(() => {
    if (show) {
      setRedes([...initialRedes || []]); 
      setSkills([...initialSkills || []]); 
      setProfession(initialProfession || ""); 
    }
  }, [show, initialRedes, initialSkills, initialProfession]);
  
  
  

  const validateFields = () => {
    if (profession.trim() === "") {
      return false;
    }
    const areRedesValid = redes.every(
      (red) => red.type.trim() !== "" && red.url.trim() !== ""
    );
    const areSkillsValid = skills.every(
      (skill) =>
        skill.name.trim() !== "" && skill.rating >= 0 && skill.rating <= 5
    );

    return areRedesValid && areSkillsValid;
  };

  const handleUpdate = async () => {
    if (!validateFields()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.uid);

      const data = {
        profession,
        redes,
        skills,
      };

      await updateDoc(userDoc, data);
    }

    handleClose();
  };

  const handleRemoveRed = (index) => {
    const updatedRedes = redes.filter((_, i) => i !== index);
    setRedes(updatedRedes);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { name: "", rating: 0 }]);
  };

  const handleAddRed = () => {
    setRedes([...redes, { type: "", url: "" }]);
  };

  return (
    <Modal className="info-modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Información</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="profession-container">
            <h2>Profesión</h2>
            <Form.Group>
              <Form.Label>Nombre de Profesión</Form.Label>
              <Form.Control
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </Form.Group>
          </div>

          <div className="network-container">
            <h2>Redes</h2>
            {redes.map((red, index) => (
              <div className="row" key={index}>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={red.type}
                      onChange={(e) => {
                        const updatedRedes = [...redes];
                        updatedRedes[index].type = e.target.value;
                        setRedes(updatedRedes);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-7">
                  <Form.Group>
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={red.url}
                      onChange={(e) => {
                        const updatedRedes = [...redes];
                        updatedRedes[index].url = e.target.value;
                        setRedes(updatedRedes);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveRed(index)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="success" onClick={handleAddRed}>
              +
            </Button>
          </div>

          <div className="skills-container">
            <h2>Habilidades</h2>
            {skills.map((skill, index) => (
              <div className="row" key={index}>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Lenguaje</Form.Label>
                    <Form.Control
                      type="text"
                      value={skill.username}
                      onChange={(e) => {
                        const updatedSkills = [...skills];
                        updatedSkills[index].name = e.target.value;
                        setSkills(updatedSkills);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-7">
                  <StarRating
                    rating={skill.rating}
                    onRatingChange={(rating) => {
                      const updatedSkills = [...skills];
                      updatedSkills[index].rating = rating;
                      setSkills(updatedSkills);
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="success" onClick={handleAddSkill}>
              {" "}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {" "}
          Cerrar{" "}
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          {" "}
          Actualizar{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateInfoModal;
