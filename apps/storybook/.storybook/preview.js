import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Nameguard", "Namekit", "ENS Utils", "ENS Webfont"],
      },
    },
  },
};

export default preview;
