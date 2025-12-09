import {
  enableLongPressStorage,
  showRandomLanguagesStorage,
} from "@/utils/storage";
import { useStorage } from "@/utils/useStorage";
import "./App.css";

function App() {
  const [enableLongPress, setEnableLongPress] = useStorage<boolean>(
    enableLongPressStorage
  );
  const [showRandomLanguages, setShowRandomLanguages] = useStorage<boolean>(
    showRandomLanguagesStorage
  );

  const handleOpenSettings = () => {
    browser.runtime.sendMessage({ action: "openSettings" });
  };

  return (
    <div className="container">
      <header>
        <h1>HeyFill</h1>
      </header>

      <div className="section">
        <div className="row">
          <span className="row-label">Enable Long Press</span>
          <label className="toggle">
            <input
              type="checkbox"
              checked={!!enableLongPress}
              onChange={(e) => setEnableLongPress(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="row">
          <span className="row-label">Show Random Languages</span>
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

      <div className="section">
        <button className="settings-btn" onClick={handleOpenSettings}>
          Edit Custom Contents
        </button>
      </div>
    </div>
  );
}

export default App;
