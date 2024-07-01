import React, { useState } from 'react';

const URLInput = ({ handleScrape }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleScrape(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
      />
      <button type="submit">Scrape</button>
    </form>
  );
};

export default URLInput;
