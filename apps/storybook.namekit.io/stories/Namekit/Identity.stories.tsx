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
      <IdentityCard address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" />
      <IdentityCard
        address="0xf81bc66316a3f2a60adc258f97f61dfcbdd23bb1"
        returnNameGuardReport
      />
    </>
  ),
};
