import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import TagContainer from "../../component/TextEditor/TagContainer";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './MinimalPosts.css';

const MinimalPosts = ({ userId, onTicketClick, updatedTicket, isProfile }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('abierto');
  const [sortOrder, setSortOrder] = useState('desc'); // default sort order
  const [indexError, setIndexError] = useState(false);

  const navigate = useNavigate();

  const handleTagsChange = (updatedTags) => {
    setSelectedTags(updatedTags);
  };

  const handleEstadoChange = (estado) => {
    setSelectedEstado(estado);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const db = getFirestore();
      const ticketsCollection = collection(db, 'ticket');

      let userTicketsQuery;
      try {
        if (userId) {
          if (selectedEstado === 'all') {
            userTicketsQuery = query(ticketsCollection, orderBy('createdAt', sortOrder));
          } else {
            userTicketsQuery = query(ticketsCollection, where('uid', '==', userId), where('estado', '==', selectedEstado), orderBy('createdAt', sortOrder));
          }
        } else {
          userTicketsQuery = query(ticketsCollection, where('estado', '==', 'abierto'), orderBy('createdAt', sortOrder));
        }

        const querySnapshot = await getDocs(userTicketsQuery);

        const fetchedTickets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTickets(fetchedTickets);
        setLoading(false);
      } catch (error) {
        if (error.code === 'failed-precondition') {
          setIndexError(true);
        } else {
          console.error("Error fetching tickets: ", error);
        }
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId, selectedEstado, updatedTicket, sortOrder]);

  useEffect(() => {
    if (updatedTicket) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
    }
  }, [updatedTicket]);

  const filteredTickets = selectedTags.length > 0
    ? tickets.filter(ticket => selectedTags.every(tag => ticket.tags?.map(t => t.toLowerCase()).includes(tag.toLowerCase())))
    : tickets;

  return (
    <div className="minimal-posts-container" >
      <div className="filters">

        {userId && (
          <div>
            <DropdownButton id="estado-filter" title={selectedEstado.charAt(0).toUpperCase() + selectedEstado.slice(1)}>
              <Dropdown.Item onClick={() => handleEstadoChange('all')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleEstadoChange('abierto')}>Abierto</Dropdown.Item>
              <Dropdown.Item onClick={() => handleEstadoChange('cerrado')}>Cerrado</Dropdown.Item>
              <Dropdown.Item onClick={() => handleEstadoChange('pausa')}>Pausa</Dropdown.Item>
            </DropdownButton>
          </div>
        )}

        <DropdownButton id="sort-order" title={sortOrder === 'desc' ? 'Más nuevos' : 'Más antiguos'}>
          <Dropdown.Item onClick={() => handleSortOrderChange('desc')}>Más nuevos</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortOrderChange('asc')}>Más antiguos</Dropdown.Item>
        </DropdownButton>

        <TagContainer onTagsChange={handleTagsChange} />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : indexError ? (
        <p>Index is being created, please wait a few moments and try again.</p>
      ) : filteredTickets.length === 0 ? (
        <p>No open tickets found.</p>
      ) : (
        <ul className="minimal-posts-list">
          {filteredTickets.map((ticket) => (
            <li
              className="minimal-posts-item"
              key={ticket.id}
              onClick={() => typeof onTicketClick === 'function' && onTicketClick(ticket.id)}
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
              >Ir al ticket</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MinimalPosts;
