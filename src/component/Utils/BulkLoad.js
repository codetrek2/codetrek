import React from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import jsonData from "./estructura.json";

const BulkImportComponent = () => {
  const db = getFirestore(); 
  const auth = getAuth(); 

  const importTickets = async () => {
    const user = auth.currentUser; 
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      for (const ticket of jsonData) {
        const newTicket = {
          ...ticket,
          createdAt: new Date(),
          uid: user.uid,
        };

        await addDoc(collection(db, "ticket"), newTicket); 
      }

      console.log("Tickets imported successfully.");
    } catch (error) {
      console.error("Error importing tickets:", error);
    }
  };

  return (
    <div>
      <button onClick={importTickets}>Importar Tickets</button> 
    </div>
  );
};

export default BulkImportComponent;
