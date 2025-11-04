import React, { useState } from 'react';
import './FindReplace.css';

interface FindReplaceProps {
  onFind?: (text: string, options: FindOptions) => void;
  onReplace?: (find: string, replace: string) => void;
  onReplaceAll?: (find: string, replace: string) => void;
  onClose?: () => void;
}

interface FindOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}

export const FindReplace: React.FC<FindReplaceProps> = ({
  onFind,
  onReplace,
  onReplaceAll,
  onClose,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [options, setOptions] = useState<FindOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });

  const handleFind = () => {
    if (onFind && findText) {
      onFind(findText, options);
    }
  };

  const handleReplace = () => {
    if (onReplace && findText && replaceText) {
      onReplace(findText, replaceText);
    }
  };

  const handleReplaceAll = () => {
    if (onReplaceAll && findText && replaceText) {
      onReplaceAll(findText, replaceText);
    }
  };

  return (
    <div className="find-replace">
      <div className="find-replace-header">
        <button
          className="toggle-replace"
          onClick={() => setShowReplace(!showReplace)}
          title="إظهار/إخفاء الاستبدال"
        >
          {showReplace ? '▼' : '▶'}
        </button>
        <span className="title">بحث{showReplace && ' واستبدال'}</span>
        <button className="close-button" onClick={onClose} title="إغلاق">
          ×
        </button>
      </div>

      <div className="find-replace-content">
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="بحث..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
          />
          <div className="search-buttons">
            <button onClick={handleFind} title="التالي">
              ↓
            </button>
            <button onClick={handleFind} title="السابق">
              ↑
            </button>
          </div>
        </div>

        {showReplace && (
          <div className="replace-row">
            <input
              type="text"
              className="replace-input"
              placeholder="استبدال..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReplace()}
            />
            <div className="replace-buttons">
              <button onClick={handleReplace} title="استبدال">
                استبدال
              </button>
              <button onClick={handleReplaceAll} title="استبدال الكل">
                الكل
              </button>
            </div>
          </div>
        )}

        <div className="options-row">
          <label>
            <input
              type="checkbox"
              checked={options.caseSensitive}
              onChange={(e) => setOptions({ ...options, caseSensitive: e.target.checked })}
            />
            <span>حساس لحالة الأحرف</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.wholeWord}
              onChange={(e) => setOptions({ ...options, wholeWord: e.target.checked })}
            />
            <span>كلمة كاملة</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.regex}
              onChange={(e) => setOptions({ ...options, regex: e.target.checked })}
            />
            <span>تعبير نمطي</span>
          </label>
        </div>
      </div>
    </div>
  );
};
