import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStorage } from "@/utils/useStorage";
import {
  enableLongPressStorage,
  customContentsStorage,
  showRandomLanguagesStorage,
  CustomContentItem,
  migrateCustomContents,
} from "@/utils/storage";
import { MenuPreview } from "@/components/MenuPreview";
import { SortableItem } from "./SortableItem";
import "./App.css";

function App() {
  const [enableLongPress, setEnableLongPress] = useStorage<boolean>(
    enableLongPressStorage
  );
  const [showRandomLanguages, setShowRandomLanguages] = useStorage<boolean>(
    showRandomLanguagesStorage
  );
  const [customContents, setCustomContents] = useStorage<CustomContentItem[]>(
    customContentsStorage
  );

  const [newValue, setNewValue] = useState("");

  // Migrate old data format on mount
  useEffect(() => {
    customContentsStorage.getValue().then((rawData) => {
      const migrated = migrateCustomContents(rawData);
      // If migration happened (data was in old format), save the new format
      if (
        rawData &&
        Array.isArray(rawData) &&
        rawData.length > 0 &&
        typeof rawData[0] === "string"
      ) {
        setCustomContents(migrated);
      }
    });
  }, []);

  // Use stable IDs from the items themselves (with safe access)
  const itemIds = customContents?.map((item) => item?.id).filter(Boolean) ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    if (!newValue.trim()) return;
    if (customContents && customContents.length >= 5) return;

    const newItem: CustomContentItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: newValue.trim(),
    };
    setCustomContents([...(customContents || []), newItem]);
    setNewValue("");
  };

  const handleDelete = (id: string) => {
    if (!customContents) return;
    setCustomContents(customContents.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over.id as string);

      if (customContents) {
        setCustomContents(arrayMove(customContents, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="header">
        <h1 className="logo-text">HeyFill Settings</h1>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="main-layout">
        {/* Settings Panel (Left) */}
        <main className="settings-panel">
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
                {customContents && customContents.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={itemIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {customContents.map((item, index) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          content={item.content}
                          index={index}
                          onDelete={() => handleDelete(item.id)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
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

        {/* Preview Panel (Right) */}
        <aside className="preview-panel">
          <div className="preview-container">
            <h3 className="preview-title">Preview</h3>
            <p className="preview-description">
              This is how your fill menu will look
            </p>
            <MenuPreview
              customContents={customContents?.map((item) => item.content) || []}
              showRandomLanguages={!!showRandomLanguages}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
