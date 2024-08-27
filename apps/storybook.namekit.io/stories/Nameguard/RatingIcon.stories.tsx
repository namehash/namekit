import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "@namehash/nameguard";
import { RatingIcon, RatingIconSize } from "@namehash/nameguard-react";

const meta: Meta<typeof RatingIcon> = {
  component: RatingIcon,
  title: "Nameguard/RatingIcon",
  argTypes: {
    rating: {
      options: Object.keys(Rating),
      control: { type: "select" },
    },
    size: {
      options: Object.keys(RatingIconSize),
      control: { type: "select" },
    },
    isInteractive: { control: { type: "boolean" } },
  },
  args: {
    isInteractive: false,
  },
};

export default meta;

type Story = StoryObj<typeof RatingIcon>;

export const Pass: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.medium,
  },
};

export const Warn: Story = {
  args: {
    rating: Rating.warn,
    size: RatingIconSize.medium,
  },
};

export const Alert: Story = {
  args: {
    rating: Rating.alert,
    size: RatingIconSize.medium,
  },
};
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
export const isInteractive: Story = {
  args: {
    rating: Rating.pass,
    size: RatingIconSize.small,
    isInteractive: true,
  },
};
