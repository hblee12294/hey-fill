import {
  enableLongPressStorage,
  customContentsStorage,
  showRandomLanguagesStorage,
} from "@/utils/storage";
import { useState } from "react";
import { useStorage } from "@/utils/useStorage";
import "./App.css";

function App() {
  const [enableLongPress, setEnableLongPress] = useStorage<boolean>(
    enableLongPressStorage
  );
  const [showRandomLanguages, setShowRandomLanguages] = useStorage<boolean>(
    showRandomLanguagesStorage
  );

  return (
    <div className="container">
      <header>
        <h1>HeyFill</h1>
      </header>

      <div className="section">
        <div className="row">
          <label htmlFor="long-press">Enable Long Press</label>
          <input
            id="long-press"
            type="checkbox"
            checked={!!enableLongPress}
            onChange={(e) => setEnableLongPress(e.target.checked)}
            className="toggle"
          />
        </div>
        <div className="row">
          <label htmlFor="show-random">Show Random Languages</label>
          <input
            id="show-random"
            type="checkbox"
            checked={!!showRandomLanguages}
            onChange={(e) => setShowRandomLanguages(e.target.checked)}
            className="toggle"
          />
        </div>
      </div>

      <CustomContentSection />
    </div>
  );
}

function CustomContentSection() {
  const [customContents, setCustomContents] = useStorage<string[]>(
    customContentsStorage
  );

  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (!newValue.trim()) return;
    if (customContents && customContents.length >= 5) return;

    setCustomContents([...(customContents || []), newValue.trim()]);
    setNewValue("");
  };

  const handleDelete = (index: number) => {
    if (!customContents) return;
    const newContents = [...customContents];
    newContents.splice(index, 1);
    setCustomContents(newContents);
  };

  return (
    <div className="section">
      <h2>Custom Content ({customContents?.length || 0}/5)</h2>

      <div className="custom-content-list">
        {customContents?.map((content, index) => (
          <div key={index} className="custom-content-item">
            <span className="content-text" title={content}>
              {content}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleDelete(index)}
              aria-label="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="add-content-row">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Add custom sentence..."
          disabled={(customContents?.length ?? 0) >= 5}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!newValue.trim() || (customContents?.length ?? 0) >= 5}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default App;
