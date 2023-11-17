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

const newUtilities = {
  ".font-ss02": {
    "-webkit-font-feature-settings": "'ss02' 1, 'calt' 0",
    "-moz-font-feature-settings": "'ss02' 1, 'calt' 0",
    "-ms-font-feature-settings": "'ss02' 1, 'calt' 0",
    "font-feature-settings": "'ss02' 1, 'calt' 0",
  },
};

const baseFontSettings = {
  body: {
    "-webkit-font-feature-settings": '"calt" 0',
    "-moz-font-feature-settings": '"calt" 0',
    "-ms-font-feature-settings": '"calt" 0',
    "font-feature-settings": '"calt" 0',
  },
};

const fontPlugin = plugin(
  function ({ addBase, addUtilities }) {
    addUtilities(newUtilities);
    addBase(baseFontSettings);
  },
  {
    theme: {
      fontFamily: {
        maxEmojisAndCharsSupport: [
          "Inter",
          ...fallbackSystemEmojiFonts,
          "Noto Emoji",
          ...fallbackSystemCharacterFonts,
          "Unifont",
        ],
      },
    },
  }
);

export default fontPlugin;
