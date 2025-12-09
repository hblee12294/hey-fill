import { useState } from "react";
import { useStorage } from "@/utils/useStorage";
import {
  enableLongPressStorage,
  customContentsStorage,
  showRandomLanguagesStorage,
} from "@/utils/storage";
import "./App.css";

function App() {
  const [enableLongPress, setEnableLongPress] = useStorage<boolean>(
    enableLongPressStorage
  );
  const [showRandomLanguages, setShowRandomLanguages] = useStorage<boolean>(
    showRandomLanguagesStorage
  );
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
    <div className="settings-container">
      {/* Header */}
      <header className="header">
        <span className="logo-icon"></span>
        <h1 className="logo-text">HeyFill Settings</h1>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* General Settings Section */}
        <section className="section">
          <h2 className="section-title">General</h2>

          <div className="setting-card">
            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">Enable Long Press</h3>
                <p className="setting-description">
                  Press and hold on input fields to show the fill menu
                </p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={!!enableLongPress}
                  onChange={(e) => setEnableLongPress(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-divider"></div>

            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">Show Random Languages</h3>
                <p className="setting-description">
                  Display random language options in the fill menu
                </p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={!!showRandomLanguages}
                  onChange={(e) => setShowRandomLanguages(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Custom Content Section */}
        <section className="section">
          <h2 className="section-title">Custom Content</h2>
          <p className="section-description">
            Add up to 5 custom sentences that will appear in your fill menu
          </p>

          <div className="setting-card">
            <div className="custom-list">
              {customContents?.map((content, index) => (
                <div key={index} className="custom-item">
                  <span className="custom-number">{index + 1}</span>
                  <span className="custom-text">{content}</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                    aria-label="Delete"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {(!customContents || customContents.length === 0) && (
                <div className="empty-state">
                  <p>No custom content yet. Add your first one below!</p>
                </div>
              )}
            </div>

            {(customContents?.length ?? 0) < 5 && (
              <div className="add-form">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter a custom sentence..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                  }}
                />
                <button
                  onClick={handleAdd}
                  disabled={!newValue.trim()}
                  className="add-btn"
                >
                  Add
                </button>
              </div>
            )}

            <div className="counter">
              {customContents?.length || 0} / 5 custom contents
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
