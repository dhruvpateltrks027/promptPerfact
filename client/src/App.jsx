import { useState } from 'react';
 

function App() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleRephrase = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt to rephrase.');
      return;
    }

    setIsLoading(true);


    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/rephrase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rephrased text');
      }

      const data = await response.json();

      if (data.text) {
        setOutput(data.text);
      } else if (data.rephrased && data.rephrased.text) {
        setOutput(data.rephrased.text);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while rephrasing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>
      <div className="background-glow"></div>
      <div className="container">
        <header>
          <h1>Prompt Perfect</h1>
          <p>Transform your prompts into perfection.</p>
        </header>

        <main>
        <div className="main-grid">
          <div className="input-section">
            <label htmlFor="promptInput">Enter your prompt</label>
            <textarea
              id="promptInput"
              placeholder="e.g., how to check server access..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <button 
              className="rephrase-btn" 
              onClick={handleRephrase} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="btn-text">Rephrase</span>
              )}
            </button>
          </div>

          <div className="output-section" id="outputSection">
            <div className="output-header">
              <label>Rephrased Result</label>
              {(output && !isLoading) && (
                <button
                  className="icon-btn"
                  aria-label="Copy to clipboard"
                  onClick={handleCopy}
                >
                  {copySuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="output-content">
              {isLoading ? (
                <div className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              ) : output ? (
                output
              ) : (
                <div className="placeholder-text">
                  Your rephrased content will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
        </main>
      </div>
    </>
  );
}

export default App;
