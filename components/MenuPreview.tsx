import { LANGUAGES } from "@/data";
import { capitalize } from "@/utils/capitalize";
import "./styles.css";

interface MenuPreviewProps {
  customContents: string[];
  showRandomLanguages: boolean;
}

/**
 * A static preview of the fill menu for the settings page.
 * Shows how the menu will look based on current settings.
 */
export function MenuPreview({
  customContents,
  showRandomLanguages,
}: MenuPreviewProps) {
  return (
    <div className="MenuPreview">
      <div className="Menu">
        {/* Custom Contents Section */}
        {customContents.length > 0 ? (
          <>
            {customContents.map((content, index) => (
              <div key={`custom-${index}`} className="MenuItem" title={content}>
                {content.length > 20 ? content.slice(0, 20) + "..." : content}
              </div>
            ))}
          </>
        ) : (
          <div className="MenuItem">+ Custom Content</div>
        )}

        {/* Separator */}
        {showRandomLanguages && <div className="MenuSeparator" />}

        {/* Random Languages Section */}
        {showRandomLanguages && (
          <>
            <div className="MenuLabel">Random</div>
            {LANGUAGES.map((language) => (
              <div key={language} className="MenuItem">
                {capitalize(language)}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
