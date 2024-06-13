import type { Meta, StoryObj } from "@storybook/react";
import { DomainCard } from "@namehash/namekit-react";

const meta: Meta<typeof DomainCard> = {
  component: DomainCard,
  title: "Namekit/DomainCard",
  args: {
    name: "lightwalker.eth",
  },
};

export default meta;

type Story = StoryObj<typeof DomainCard>;

export const Default: Story = {};
