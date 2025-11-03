import './Terminal.css';

export function Terminal() {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-title">bash</span>
        <div className="terminal-actions">
          <button className="terminal-btn">+</button>
          <button className="terminal-btn">×</button>
        </div>
      </div>
      <div className="terminal-content">
        <div className="terminal-line">
          <span className="prompt-user">amir@oqool</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~/oqool-ide-final</span>
          <span className="prompt-dollar">$ </span>
          <span className="command-text">npm run dev</span>
        </div>
        <div className="terminal-line">
          <span className="success-icon">✓</span>
          <span className="command-text"> Vite dev server running at http://localhost:5174</span>
        </div>
        <div className="terminal-line">
          <span className="info-text">🚀 Oqool IDE v1.0.0</span>
        </div>
        <div className="terminal-line terminal-mt">
          <span className="command-text">Features loaded:</span>
        </div>
        <div className="terminal-line">
          <span className="success-text">  ✓ Monaco Editor</span>
        </div>
        <div className="terminal-line">
          <span className="success-text">  ✓ IntelliSense</span>
        </div>
        <div className="terminal-line">
          <span className="success-text">  ✓ Syntax Highlighting</span>
        </div>
        <div className="terminal-line">
          <span className="success-text">  ✓ AI Assistant</span>
        </div>
        <div className="terminal-line terminal-mt">
          <span className="prompt-user">amir@oqool</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~/oqool-ide-final</span>
          <span className="prompt-dollar">$ </span>
          <span className="cursor-blink">█</span>
        </div>
      </div>
    </div>
  );
}
