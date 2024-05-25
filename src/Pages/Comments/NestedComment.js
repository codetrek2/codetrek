import React from 'react';
import "./Comment.css";

const NestedComment = ({ comments, commentUsers }) => {
  const renderNestedComments = (parentId) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="nested-comment">
          <div className="subcontent">
            <p>{commentUsers[comment.uid]?.username || "Desconocido"}</p>
            <div>{comment.text}</div>
          </div>
          {renderNestedComments(comment.id)}
        </div>
      ));
  };

  // Render top-level comments
  return comments
    .filter((comment) => !comment.parentCommentId)
    .map((comment) => (
      <div key={comment.id} className="top-level-comment">
        <div className="content">
          <p>{commentUsers[comment.uid]?.username || "Desconocido"}</p>
          <div>{comment.text}</div>
        </div>
        {renderNestedComments(comment.id)}
      </div>
    ));
};

export default NestedComment;
