import React from "react";

import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

import { Preview } from "@storybook/react";

import {
  Title,
  Subtitle,
  Description,
  // Primary, // TODO: Hiding `Primary` for now until we can fix the issue with `Controls`.
  // Controls, // TODO: See comment below about why we're hiding this for now.
  Stories,
} from "@storybook/blocks";

import "../global.css";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Nameguard", "Namekit", "ENS Utils", "ENS Webfont"],
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          {/* TODO: Hiding `Primary` for now until we can fix the issue with `Controls`. */}
          {/* <Primary /> */}
          {/* TODO: For some future PR we can investigate getting the "autodocs" in
              Storybook to properly detect our JSDocs comments. Already spent a few
              hours trying to fix this. It seems it can be non-trivial to configure
              properly in a monorepo.

              As a temporary workaround, hiding <Controls /> below.

              This hides the impact of JSDocs not being picked up by Storybook.
           */}
          {/* <Controls /> */}
          <Stories />
        </>
      ),
    },
  },
};

export default preview;
