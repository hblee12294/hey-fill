import ReactDOM from "react-dom/client";
import { Popup } from "@/components/Popup.tsx";
import { Menu, MenuItem, MenuSeparator } from "@/components/DropdownMenu.tsx";
import { MenuContent } from "@/components/MenuContent";
import "@/components/styles.css";
import { customContentsStorage, migrateCustomContents } from "@/utils/storage";
import { useEffect, useState } from "react";

function isInputElement(
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement {
  if (!element) {
    return false;
  }

  return element.tagName === "INPUT" || element.tagName === "TEXTAREA";
}

function isContentEditableElement(
  element: Element | null
): element is HTMLElement {
  if (!element) {
    return false;
  }

  return (element as HTMLElement).isContentEditable;
}

export default defineContentScript({
  matches: ["<all_urls>"],

  main(ctx) {
    let lastActiveElement: HTMLElement | null = null;
    let lastRange: Range | null = null;

    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "fillContent") {
        if (lastActiveElement) {
          const activeElement = lastActiveElement;

          if (isInputElement(activeElement)) {
            const inputElement = activeElement as HTMLInputElement;

            const start = inputElement.selectionStart ?? 0;
            const end = inputElement.selectionEnd ?? 0;
            const currentValue = inputElement.value;

            // Insert content at cursor position
            inputElement.value =
              currentValue.slice(0, start) +
              message.content +
              currentValue.slice(end);

            // Move cursor to end of inserted content
            inputElement.setSelectionRange(
              start + message.content.length,
              start + message.content.length
            );

            const event = new Event("input", { bubbles: true });

            activeElement.dispatchEvent(event);
          } else if (isContentEditableElement(activeElement)) {
            activeElement.focus();
            if (lastRange) {
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(lastRange);
            }
            document.execCommand("insertText", false, message.content);
          }
        } else {
          const activeElement = document.activeElement;

          if (!activeElement) {
            return;
          }

          if (isInputElement(activeElement)) {
            const inputElement = activeElement as HTMLInputElement;

            const start = inputElement.selectionStart ?? 0;
            const end = inputElement.selectionEnd ?? 0;
            const currentValue = inputElement.value;

            // Insert content at cursor position
            inputElement.value =
              currentValue.slice(0, start) +
              message.content +
              currentValue.slice(end);

            // Move cursor to end of inserted content
            inputElement.setSelectionRange(
              start + message.content.length,
              start + message.content.length
            );

            const event = new Event("input", { bubbles: true });

            activeElement.dispatchEvent(event);
          }
          // Handle contenteditable elements
          else if ((activeElement as HTMLElement).isContentEditable) {
            document.execCommand("insertText", false, message.content);
          }
        }
      }
    });

    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container);

        const ContentApp = () => {
          const [customContents, setCustomContents] = useState<
            Array<{ id: string; content: string }>
          >([]);
          const [showRandomLanguages, setShowRandomLanguages] =
            useState<boolean>(true);

          useEffect(() => {
            customContentsStorage.getValue().then((rawData) => {
              setCustomContents(migrateCustomContents(rawData));
            });
            showRandomLanguagesStorage.getValue().then(setShowRandomLanguages);

            const unwatchCustom = customContentsStorage.watch((rawData) => {
              setCustomContents(migrateCustomContents(rawData));
            });
            const unwatchRandom = showRandomLanguagesStorage.watch(
              setShowRandomLanguages
            );

            return () => {
              unwatchCustom();
              unwatchRandom();
            };
          }, []);

          const handleInsertContent = (content: string) => {
            if (lastActiveElement) {
              const activeElement = lastActiveElement;
              if (isInputElement(activeElement)) {
                const inputElement = activeElement as HTMLInputElement;
                const start = inputElement.selectionStart ?? 0;
                const end = inputElement.selectionEnd ?? 0;
                const currentValue = inputElement.value;

                inputElement.value =
                  currentValue.slice(0, start) +
                  content +
                  currentValue.slice(end);

                inputElement.setSelectionRange(
                  start + content.length,
                  start + content.length
                );

                const event = new Event("input", { bubbles: true });
                activeElement.dispatchEvent(event);
              } else if (isContentEditableElement(activeElement)) {
                activeElement.focus();
                if (lastRange) {
                  const selection = window.getSelection();
                  selection?.removeAllRanges();
                  selection?.addRange(lastRange);
                }
                document.execCommand("insertText", false, content);
              }
            }
          };

          return (
            <Popup
              onPopupOpen={(element) => {
                lastActiveElement = element;
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  lastRange = selection.getRangeAt(0);
                }
              }}
            >
              <Menu
                node={
                  <div>
                    <button className="FillButton">Fill</button>
                  </div>
                }
              >
                <MenuContent
                  customContents={customContents.map((item) => item.content)}
                  showRandomLanguages={showRandomLanguages}
                  onCustomContentClick={handleInsertContent}
                  onAddCustomClick={() => {
                    browser.runtime.sendMessage({ action: "openPopup" });
                  }}
                  onLanguageClick={(language) => {
                    browser.runtime.sendMessage({
                      action: "requestContent",
                      language: language,
                    });
                  }}
                  renderItem={(key, node, onClick) => (
                    <MenuItem key={key} node={node} onClick={onClick} />
                  )}
                  renderSeparator={() => <MenuSeparator />}
                />
              </Menu>
            </Popup>
          );
        };

        root.render(<ContentApp />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
