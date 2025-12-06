import { storage } from "#imports";

export const enableLongPressStorage = storage.defineItem<boolean>(
  "local:enableLongPress",
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
