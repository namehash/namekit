import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Identity } from "@namehash/namekit-react/client";

const meta: Meta<typeof Identity.Root> = {
  title: "Namekit/Identity",
  component: Identity.Root,
  argTypes: {
    address: { control: "text" },
    network: {
      control: {
        type: "select",
        options: ["mainnet", "sepolia"],
      },
    },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Identity.Root>;

const IdentityCard: React.FC<{
  address: string;
  network?: "mainnet" | "sepolia";
}> = ({ address, network }) => (
  <Identity.Root address={address} network={network}>
    <Identity.Avatar />
    <Identity.Name />
    <Identity.Address />
    <Identity.NameGuardShield />
  </Identity.Root>
);

export const Default: Story = {
  args: {
    address: "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9",
    network: "mainnet",
    className: "rounded-xl",
  },
  render: (args) => <IdentityCard {...args} />,
};

export const MultipleCards: Story = {
  render: () => (
    <>
      <IdentityCard address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9" />
      <IdentityCard address="0x123456789abcdef123456789abcdef123456789a" />
      <IdentityCard address="0xabcdef123456789abcdef123456789abcdef1234" />
      <IdentityCard address="0x987654321fedcba987654321fedcba987654321f" />
      <IdentityCard
        address="0xfedcba987654321fedcba987654321fedcba9876"
        network="sepolia"
      />
      <IdentityCard address="0x111222333444555666777888999000aaabbbcccd" />
    </>
  ),
};
