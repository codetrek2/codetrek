import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import TagContainer from "../../component/TextEditor/TagContainer";

import './MinimalPosts.css';

const UserPosts = ({ userId, onTicketClick }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate();

    const handleTagsChange = (updatedTags) => {
        setSelectedTags(updatedTags);
    };

    useEffect(() => {
        const fetchTickets = async () => {
            const db = getFirestore();
            const ticketsCollection = collection(db, 'ticket');

            let querySnapshot;
            if (userId) {
                const userTicketsQuery = query(ticketsCollection, where('uid', '==', userId));
                querySnapshot = await getDocs(userTicketsQuery);
            } else {
                const userTicketsQuery = query(ticketsCollection, where('estado', '!=', 'cerrado'));
                querySnapshot = await getDocs(userTicketsQuery);
            }

            const fetchedTickets = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTickets(fetchedTickets);
            setLoading(false);
        };

        fetchTickets();
    }, [userId]);

    const filteredTickets = selectedTags.length > 0
        ? tickets.filter(ticket => selectedTags.every(tag => ticket.tags?.map(t => t.toLowerCase()).includes(tag.toLowerCase())))
        : tickets;

    return (
        <div className="minimal-posts-container">
            <TagContainer onTagsChange={handleTagsChange} />

            {loading ? (
                <p>Cargando...</p>
            ) : filteredTickets.length === 0 ? (
                <p>No open tickets found.</p>
            ) : (
                <ul className="minimal-posts-list">
                    {filteredTickets.map((ticket) => (
                        <li
                            className="minimal-posts-item"
                            key={ticket.id}
                            onClick={() => onTicketClick(ticket.id)}
                        >
                            <h3>{ticket.title}</h3>
                            <p>
                                <strong>Tags:</strong> {ticket.tags?.join(', ') || 'No Tags'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {ticket.type || 'Desconocido'}
                            </p>
                            <button
                                onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >Ir al Ticket</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPosts;
