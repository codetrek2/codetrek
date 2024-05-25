import React from "react";

const ArticleConstructor = ({ title, tags, content, actions }) => {
  // Separar los tags en una matriz
  const tagList = tags.split(',').map(tag => tag.trim());

  return (
    <div className="swiper">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <div className="box-post">
            <h4>{title}</h4>
            {/* Mapear sobre la lista de tags */}
            <div className="tags-container">
              {tagList.map((tag, index) => (
                <span key={index} className="tags">{tag}</span>
              ))}
            </div>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleConstructor;

