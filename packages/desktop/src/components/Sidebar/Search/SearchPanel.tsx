import React, { useState } from 'react';
import './SearchPanel.css';

interface SearchResult {
  file: string;
  line: number;
  column: number;
  text: string;
  preview: string;
}

export const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {return;}

    setSearching(true);
    // TODO: Implement actual search functionality
    setTimeout(() => {
      setResults([
        {
          file: 'src/App.tsx',
          line: 10,
          column: 5,
          text: query,
          preview: `function App() { ${query} }`,
        },
      ]);
      setSearching(false);
    }, 500);
  };

  return (
    <div className="search-panel">
      <div className="search-header">
        <h3>🔍 البحث</h3>
      </div>

      <div className="search-input-section">
        <input
          type="text"
          className="search-input"
          placeholder="بحث في الملفات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          بحث
        </button>
      </div>

      <div className="search-results">
        {searching ? (
          <div className="search-loading">جاري البحث...</div>
        ) : results.length > 0 ? (
          <>
            <div className="results-header">
              {results.length} نتيجة في {new Set(results.map((r) => r.file)).size} ملف
            </div>
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{result.file}</span>
                </div>
                <div className="result-location">
                  السطر {result.line}, العمود {result.column}
                </div>
                <div className="result-preview">{result.preview}</div>
              </div>
            ))}
          </>
        ) : query ? (
          <div className="no-results">لا توجد نتائج</div>
        ) : (
          <div className="search-hint">ابحث عن نص في جميع الملفات</div>
        )}
      </div>
    </div>
  );
};
