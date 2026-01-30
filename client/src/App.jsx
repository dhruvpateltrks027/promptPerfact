import { useState, useEffect } from 'react';
import WaveBackground from './components/WaveBackground';

function App() {
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('promptPerfect_prompt') || '';
  });
  const [output, setOutput] = useState(() => {
    return localStorage.getItem('promptPerfect_output') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [outputLoaded, setOutputLoaded] = useState(() => {
    return !!localStorage.getItem('promptPerfect_output');
  });
  const [outputKey, setOutputKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('promptPerfect_prompt', prompt);
  }, [prompt]);

  useEffect(() => {
    if (output) {
      localStorage.setItem('promptPerfect_output', output);
    }
  }, [output]);

  const handleRephrase = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/rephrase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const result = data.text || data.rephrased?.text;
      
      if (result) {
        setOutput(result);
        setOutputKey(prev => prev + 1);
        setOutputLoaded(true);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOutput('');
    setOutputLoaded(false);
    localStorage.removeItem('promptPerfect_prompt');
    localStorage.removeItem('promptPerfect_output');
  };

  return (
    <div className="app-container">
      {/* Vanta.js Wave Animation Background */}
      <WaveBackground />
      {/* Increased top padding for badge breathing room */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-24 pb-20 lg:pt-32">
        
        {/* Header - Significantly Increased Spacing */}
        <header className="text-center grid gap-5 mb-40 lg:mb-56 animate-enter">
          {/* AI Badge */}
          <div className="flex justify-center mb-6">
            <div className="badge-ai">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Powered
            </div>
          </div>
          
          {/* Title - Gradient Text */}
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight font-[Outfit]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
              PROMPT ENHANCER
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-violet-200/60 text-lg max-w-2xl mx-auto tracking-wide">
            
          </div>
        </header>

        {/* Main Workspace - Added gap-y-16 for mobile stacking */}
        <main className="w-full max-w-6xl pb-20 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 gap-x-8 lg:gap-12 items-start">
            
            {/* ========== INPUT PROMPT Card ========== */}
            <div className="grid gap-3 glow-card card-animated-border animate-enter stagger-1 ">
              {/* Card Label */}
              <div className="card-label">
                INPUT PROMPT
              </div>
              
              {/* Inner Container with Wave Animation */}
              <div className="card-inner">
                {/* Visual Effects */}
                <div className="bg-wave-animation"></div>
                <div className="input-accent-line"></div>
                
                <textarea
                  id="promptInput"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Enter your initial prompt here... e.g., "A futuristic city landscape"'
                  className="prompt-input"
                />
              </div>
              
              {/* Action Row */}
              <div className="flex items-center gap-4 mt-6">
                <button 
                  onClick={handleRephrase}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-primary-enhance flex-1 justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>ENHANCING...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>ENHANCE</span>
                    </>
                  )}
                </button>
                
                {(prompt || output) && (
                  <button onClick={handleClear} className="btn-icon-round" title="Clear All">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* ========== ENHANCED OUTPUT Card ========== */}
            <div key={outputKey} className="glow-card card-animated-border animate-enter stagger-2">
              {/* Card Label */}
              <div className="card-label">
                ENHANCED OUTPUT
              </div>
              
              {/* Inner Container */}
              <div className="card-inner relative border-cyan-500/20">
                {/* Subtle blue glow for output card inner */}
                <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
                
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                     {/* Custom Spinner */}
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-cyan-400 animate-pulse font-medium tracking-wide">Enhancing your prompt...</p>
                  </div>
                ) : output ? (
                  <div className={`output-text relative z-10 ${outputLoaded ? 'animate-enter' : ''}`}>
                    {output}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center py-20">
                    <p className="text-white/30 italic text-center">
                      Your enhanced prompt will appear here...
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons - Pill Shaped */}
              {output && !isLoading && (
                <div className="flex flex-col gap-4">
                  
                   <button onClick={handleCopy} className="btn-action-pill justify-center w-full border-white/20 hover:border-cyan-400 hover:text-cyan-400">
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        COPIED TO CLIPBOARD
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        COPY TO CLIPBOARD
                      </>
                    )}
                  </button>
                    <button onClick={handleRephrase} className="btn-action-pill flex-1 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      REGENERATE
                    </button>
                    
                  
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
