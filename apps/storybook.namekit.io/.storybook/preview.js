import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

import "../global.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

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
