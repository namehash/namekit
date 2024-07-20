import { getMockedDomainCard, DomainStatus } from "./utils";
import type { Meta, StoryObj } from "@storybook/react";
import { DomainMenu } from "@namehash/namekit-react";

const meta: Meta<typeof DomainMenu> = {
  title: "Namekit/DomainMenu",
  component: DomainMenu,
  args: {
    domainCard: getMockedDomainCard({ domainStatus: DomainStatus.Normal }),
  },
};

export default meta;

type Story = StoryObj<typeof DomainMenu>;

export const DomainMenuExample: Story = {};
