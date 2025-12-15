import { MenuContent } from "./MenuContent";
import "./styles.css";

interface MenuPreviewProps {
  customContents: string[];
  showRandomLanguages: boolean;
}

/**
 * A static preview of the fill menu for the settings page.
 * Uses the shared MenuContent component for consistent UI.
 */
export function MenuPreview({
  customContents,
  showRandomLanguages,
}: MenuPreviewProps) {
  return (
    <div className="MenuPreview">
      <div className="Menu">
        <MenuContent
          customContents={customContents}
          showRandomLanguages={showRandomLanguages}
          renderItem={(key, node) => (
            <div key={key} className="MenuItem">
              {node}
            </div>
          )}
          renderSeparator={() => <div className="MenuSeparator" />}
        />
      </div>
    </div>
  );
}
