import React, { useState } from 'react';
import TagSelector from './TagSelector';
import { Badge } from 'react-bootstrap';

const TagContainer = ({ onTagsChange }) => {
  const [selectedTag, setSelectedTag] = useState('');
  const [addedTags, setAddedTags] = useState([]);

  const handleSelect = (tag) => {
    setSelectedTag(tag.toLowerCase());
  };

  const handleAddTag = () => {
    if (selectedTag && !addedTags.includes(selectedTag)) {
      const updatedTags = [...addedTags, selectedTag];
      setAddedTags(updatedTags);
      setSelectedTag('');
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = addedTags.filter((tag) => tag !== tagToRemove);
    setAddedTags(updatedTags);
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
  };

  return (
    <>
      <div className="tags">
        <TagSelector onSelect={handleSelect} />
        <button id="btn-edit" onClick={handleAddTag}>Agregar</button>
      </div>

      <div className="selected-tags">
        {addedTags.map((tag, index) => (
          <Badge
            key={index}
            pill
            variant="secondary"
            onClick={() => handleRemoveTag(tag)}
            style={{ cursor: 'pointer', margin: '5px' }}
          >
            {tag}
          </Badge>
        ))}
      </div>

    </>
  );
};

export default TagContainer;
