import { storage } from "#imports";

export interface CustomContentItem {
  id: string;
  content: string;
}

/**
 * Migrates old string[] format to new CustomContentItem[] format.
 * Returns the data as-is if already in new format, or converts if in old format.
 */
export function migrateCustomContents(
  data: unknown
): CustomContentItem[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  // Check if it's already in the new format (array of objects with id and content)
  if (data.length > 0 && typeof data[0] === "object" && data[0] !== null && "id" in data[0] && "content" in data[0]) {
    return data as CustomContentItem[];
  }

  // It's in the old format (array of strings), migrate it
  if (data.length > 0 && typeof data[0] === "string") {
    return (data as string[]).map((content, index) => ({
      id: `migrated-${Date.now()}-${index}`,
      content,
    }));
  }

  return [];
}

export const enableLongPressStorage = storage.defineItem<boolean>(
  "local:enableLongPress",
  {
    defaultValue: true,
  }
);

export const showRandomLanguagesStorage = storage.defineItem<boolean>(
  "local:showRandomLanguages",
  {
    defaultValue: true,
  }
);

export const customContentsStorage = storage.defineItem<CustomContentItem[]>(
  "local:customContents",
  {
    defaultValue: [],
  }
);
