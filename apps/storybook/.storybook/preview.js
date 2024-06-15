import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Nameguard", "Namekit", "ENS Utils", "ENS Webfont"],
      },
    },
  },

};

export default preview;
