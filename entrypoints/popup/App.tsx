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

      <div className="section">
        <button className="settings-btn" onClick={handleOpenSettings}>
          ✏️ Edit Custom Contents
        </button>
      </div>
    </div>
  );
}

export default App;
