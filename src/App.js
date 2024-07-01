import React, { useState } from 'react';
import TextInput from './components/TextInput';
import URLInput from './components/URLInput';
import Results from './components/Results';
import { scrapeWebContent, mockSummarize } from './utils';
import jsPDF from 'jspdf';

const App = () => {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summaryLength, setSummaryLength] = useState('short'); // New state for summary length
  const [history, setHistory] = useState([]); // New state for history

  const handleScrape = async (url) => {
    setLoading(true);
    setError('');
    try {
      const scrapedContent = await scrapeWebContent(url);
      setContent(scrapedContent);
    } catch (err) {
      setError('Scraping failed');
    }
    setLoading(false);
  };

  const handleSummarize = (inputContent) => {
    setLoading(true);
    setError('');
    try {
      let length = 50; // Default length for short summary
      if (summaryLength === 'medium') length = 100;
      else if (summaryLength === 'long') length = 200;

      const summary = mockSummarize(inputContent, length);
      setSummary(summary);
      setHistory([...history, { content: inputContent, summary }]); // Save to history
    } catch (err) {
      setError('Summarization failed');
    }
    setLoading(false);
  };

  const exportSummaryAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'summary.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const exportSummaryAsPDF = () => {
    const doc = new jsPDF();
    doc.text(summary, 10, 10);
    doc.save('summary.pdf');
  };

  return (
    <div className="App">
      <h1>AI-Powered Content Summarizer</h1>
      <URLInput handleScrape={handleScrape} />
      <TextInput content={content} setContent={setContent} />

      {/* Summary length options */}
      <div>
        <label>
          <input
            type="radio"
            value="short"
            checked={summaryLength === 'short'}
            onChange={(e) => setSummaryLength(e.target.value)}
          />
          Short
        </label>
        <label>
          <input
            type="radio"
            value="medium"
            checked={summaryLength === 'medium'}
            onChange={(e) => setSummaryLength(e.target.value)}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            value="long"
            checked={summaryLength === 'long'}
            onChange={(e) => setSummaryLength(e.target.value)}
          />
          Long
        </label>
      </div>

      <button onClick={() => handleSummarize(content)}>Summarize</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <Results original={content} summary={summary} />

      {/* Export buttons */}
      <button onClick={exportSummaryAsText}>Export as Text</button>
      <button onClick={exportSummaryAsPDF}>Export as PDF</button>

      {/* History */}
      <div>
        <h2>History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>Original:</strong> {item.content}
              <br />
              <strong>Summary:</strong> {item.summary}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
