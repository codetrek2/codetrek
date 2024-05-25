import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();
const auth = getAuth();

export const fetchUserTickets = async (userId) => {
    try {
        const userTicketsQuery = query(collection(db, 'ticket'), where('uid', '==', userId));
        const querySnapshot = await getDocs(userTicketsQuery);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        throw error;
    }
};

export const fetchTickets = async (tags = []) => {
    try {
        const ticketsCollection = collection(db, 'ticket');
        let ticketsQuery;

        if (tags.length > 0) {
            ticketsQuery = query(ticketsCollection, where('tags', 'array-contains-any', tags), where('estado', '!=', 'cerrado'));
        } else {
            ticketsQuery = query(ticketsCollection, where('estado', '==', 'abierto'));
        }

        const querySnapshot = await getDocs(ticketsQuery);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
};

export const fetchTicketById = async (ticketId) => {
    try {
        const ticketRef = doc(db, "ticket", ticketId);
        const ticketDoc = await getDoc(ticketRef);
        return ticketDoc.exists() ? { id: ticketId, ...ticketDoc.data() } : null;
    } catch (error) {
        console.error("Error fetching ticket:", error);
        throw error;
    }
};

export const fetchCommentsByTicketId = async (ticketId) => {
    try {
        const commentQuery = query(collection(db, "comment"), where("ticketId", "==", ticketId));
        const commentSnapshot = await getDocs(commentQuery);
        return commentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export const updateTicketState = async (ticketId, newState) => {
    try {
        const ticketDocRef = doc(db, "ticket", ticketId);
        await updateDoc(ticketDocRef, { estado: newState });
    } catch (error) {
        console.error("Error updating ticket state:", error);
        throw error;
    }
};

export const getCurrentUser = () => auth.currentUser;
