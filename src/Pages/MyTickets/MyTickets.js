import React, { useState, useEffect } from "react";
import MinimalPosts from "../../component/PostsPage/MinimalPosts";
import PrismCode from "../../component/TextEditor/PrismCode";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import "./MyTickets.css";

const MyTickets = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loadingSelectedTicket, setLoadingSelectedTicket] = useState(false);
    const [updatedTicket, setUpdatedTicket] = useState(null);

    const handleStateChange = async (newState) => {
        if (selectedTicket) {
            const updatedTicketData = await updateTicketState(selectedTicket.id, newState);
            setUpdatedTicket(updatedTicketData);
        }
    };
    const MySwal = withReactContent(Swal);

    const handleTicketClick = async (ticketId) => {
        setLoadingSelectedTicket(true);

        const db = getFirestore();
        const ticketRef = doc(db, "ticket", ticketId);
        const ticketDoc = await getDoc(ticketRef);

        if (ticketDoc.exists()) {
            const ticketData = ticketDoc.data();
            setSelectedTicket({ id: ticketId, ...ticketData });
        } else {
            setSelectedTicket(null);
        }

        setLoadingSelectedTicket(false);
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
            const updatedTicketDoc = await getDoc(ticketDocRef);
            return { id: ticketId, ...updatedTicketDoc.data() };
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: `Error al cambiar el estado`,
                icon: "error",
            });
            console.error(`Error updating ticket ${ticketId}:`, error);
        }
    };

    useEffect(() => {
        if (updatedTicket) {
            setSelectedTicket(updatedTicket);
        }
    }, [updatedTicket]);
    return (
        <section id="main">
            <div className="container row postpage mytickets" style={{ marginLeft: "7vw" }}>
                <div className="col-md-6">
                    <div className="single-clicked-post">
                        {loadingSelectedTicket ? (
                            <p>Loading...</p>
                        ) : selectedTicket ? (
                            <div>
                                <div className="display-container">
                                    <div className="display-meta">
                                        <div className="dropdown" style={{ display: "flex", gap: "5px" }}>
                                            <h4>Estado:</h4>
                                            <button
                                                className="btn btn-secondary dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuButton"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {selectedTicket.estado || "Cambiar estado"}
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleStateChange("abierto")}>
                                                        Abierto
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleStateChange("cerrado")}>
                                                        Cerrado
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleStateChange("pausa")}>
                                                        Pausa
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <p className="display-date"> Fecha apertura: {selectedTicket.createdAt?.toDate().toLocaleString()} </p>
                                        <p className="display-date-end"> Fecha cierre: {selectedTicket.autoCloseAt?.toDate().toLocaleString()} </p>
                                    </div>
                                    <h3>{selectedTicket.title}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: selectedTicket.text }} />
                                    <PrismCode
                                        code={selectedTicket.code || ""}
                                        language={selectedTicket.language || "javascript"}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p>No ticket selected</p>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <MinimalPosts userId={getAuth().currentUser?.uid} onTicketClick={handleTicketClick} updatedTicket={updatedTicket} isProfile={true} />

                </div>
            </div>
        </section>
    );
};

export default MyTickets;
