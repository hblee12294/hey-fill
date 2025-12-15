import { ReactNode } from "react";
import { LANGUAGES } from "@/data";
import { capitalize } from "@/utils/capitalize";

export interface MenuContentProps {
  customContents: string[];
  showRandomLanguages: boolean;
  /**
   * Called when a custom content item is clicked.
   * If not provided, items are non-interactive (preview mode).
   */
  onCustomContentClick?: (content: string) => void;
  /**
   * Called when the "add custom content" item is clicked.
   * If not provided, items are non-interactive (preview mode).
   */
  onAddCustomClick?: () => void;
  /**
   * Called when a language item is clicked.
   * If not provided, items are non-interactive (preview mode).
   */
  onLanguageClick?: (language: string) => void;
  /**
   * Render a menu item. Allows customization for interactive vs static rendering.
   * Receives the content node and optional click handler.
   */
  renderItem: (key: string, node: ReactNode, onClick?: () => void) => ReactNode;
  /**
   * Render a separator between sections.
   */
  renderSeparator: () => ReactNode;
}

/**
 * Shared menu content that can be used in both the content script menu
 * and the settings preview. This ensures UI consistency.
 */
export function MenuContent({
  customContents,
  showRandomLanguages,
  onCustomContentClick,
  onAddCustomClick,
  onLanguageClick,
  renderItem,
  renderSeparator,
}: MenuContentProps) {
  return (
    <>
      {/* Custom Contents Section */}
      {customContents.length > 0 ? (
        <>
          {customContents.map((content, index) =>
            renderItem(
              `custom-${index}`,
              <div title={content}>
                {content.length > 20 ? content.slice(0, 20) + "..." : content}
              </div>,
              onCustomContentClick
                ? () => onCustomContentClick(content)
                : undefined
            )
          )}
        </>
      ) : (
        renderItem("add-custom", <div>+ Custom Content</div>, onAddCustomClick)
      )}

      {/* Separator */}
      {showRandomLanguages && renderSeparator()}

      {/* Random Languages Section */}
      {showRandomLanguages && (
        <>
          <div className="MenuLabel">Random</div>
          {LANGUAGES.map((language) =>
            renderItem(
              `lang-${language}`,
              <div>{capitalize(language)}</div>,
              onLanguageClick ? () => onLanguageClick(language) : undefined
            )
          )}
        </>
      )}
    </>
  );
}
