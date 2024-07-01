import React from 'react';

const TextInput = ({ content, setContent }) => {
  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste or type your content here"
        rows="10"
        cols="50"
      ></textarea>
    </div>
  );
};

export default TextInput;
