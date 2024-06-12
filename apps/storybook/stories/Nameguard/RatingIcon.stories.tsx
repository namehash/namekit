import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "@namehash/nameguard";
import { RatingIcon, RatingIconSize } from "@namehash/nameguard-react";

const meta: Meta<typeof RatingIcon> = {
  component: RatingIcon,
  title: "Nameguard/RatingIcon",
  parameters: {
    controls: {
      exclude: ["size", "isInteractive"],
    },
  },
  argTypes: {
    rating: {
      options: [Rating.pass, Rating.warn, Rating.alert],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RatingIcon>;

export const Large: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.large,
  },
};

export const Medium: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.medium,
  },
};

export const Small: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.small,
  },
};

export const Micro: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.micro,
  },
};

export const Interactive: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.small,
    isInteractive: true,
  },
};
