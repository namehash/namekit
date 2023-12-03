import plugin from "tailwindcss/plugin";

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

const ensWebfontPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".ens-name": {
      fontFamily: [
        "Inter",
        ...fallbackSystemEmojiFonts,
        "Noto Emoji",
        ...fallbackSystemCharacterFonts,
        "Unifont",
      ],
      "-webkit-font-feature-settings": "'ss02' 1, 'calt' 0",
      "-moz-font-feature-settings": "'ss02' 1, 'calt' 0",
      "-ms-font-feature-settings": "'ss02' 1, 'calt' 0",
      "font-feature-settings": "'ss02' 1, 'calt' 0",
    },
  });
});

export default ensWebfontPlugin;
