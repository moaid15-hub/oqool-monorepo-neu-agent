/// <reference lib="dom" />
import './Titlebar.css';

export function Titlebar() {
  const handleMinimize = () => {
    console.log('Minimize window');
    alert('Minimize - Window management requires Electron');
  };

  const handleMaximize = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof document !== 'undefined') {
      document.documentElement.requestFullscreen();
    }
  };

  const handleClose = () => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to close the IDE?')
    ) {
      window.close();
    }
  };

  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <span className="logo-icon">🎨</span>
        <span className="logo-text">Oqool Desktop IDE</span>
      </div>
      <div className="titlebar-controls">
        <button className="titlebar-button minimize" title="Minimize" onClick={handleMinimize}>
          ─
        </button>
        <button
          className="titlebar-button maximize"
          title="Maximize/Fullscreen"
          onClick={handleMaximize}
        >
          □
        </button>
        <button className="titlebar-button close" title="Close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
}
