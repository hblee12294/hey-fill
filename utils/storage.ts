import { storage } from "#imports";


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



export const customContentsStorage = storage.defineItem<string[]>(
  "local:customContents",
  {
    defaultValue: [],
  }
);
