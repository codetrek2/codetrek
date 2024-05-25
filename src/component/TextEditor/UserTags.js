import React from 'react';
import { Badge } from 'react-bootstrap'; 

const UserTags = ({ tags }) => {
  return (
    <div className="user-tags-container">
      {tags && tags.length > 0 ? (
        <div className="tags-list">
          {tags.map((tag, index) => (
            <Badge key={index} pill variant="info" style={{ margin: '5px' }}>
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <p>No hay tags disponibles para este ticket.</p> 
      )}
    </div>
  );
};

export default UserTags;
