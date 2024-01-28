const fallbackSystemEmojiFonts = [
  "Noto Color Emoji",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Android Emoji",
  "EmojiSymbols",
  "EmojiOne Mozilla",
  "Twemoji Mozilla",
  "Segoe UI Symbol",
  "emoji",
];

const fallbackSystemCharacterFonts = [
  "Tahoma",
  "Ubuntu",
  "Lucida Grande",
  "Microsoft Sans Serif",
  "San Francisco",
  "Helvetica",
  "DejaVu Sans",
  "ui-sans-serif",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "system-ui",
];

export const ensNamesFontName = "ens-name";
export const ensNameFontStack = [
  "Inter",
  ...fallbackSystemEmojiFonts,
  "Noto Emoji",
  ...fallbackSystemCharacterFonts,
  "Unifont",
];

export const ensNameFontClassName = `font-ss02 font-${ensNamesFontName}`;
