import type { Meta, StoryObj } from "@storybook/react";
import { buildENSName } from "@namehash/ens-utils";
import { EnsAvatar } from "@namehash/namekit-react";
import { ENSNameVariant, getENSnameFor } from "./utils";

const meta: Meta<typeof EnsAvatar> = {
  title: "Namekit/EnsAvatar",
  parameters: {
    layout: "centered",
  },
  component: EnsAvatar,
  args: {
    name: getENSnameFor(ENSNameVariant.NormalizedWithAvatar),
  },
};

export default meta;

type Story = StoryObj<typeof EnsAvatar>;

export const EnsAvatarForNormalizedENSNameWithAvatarPicture: Story = {
  args: { name: getENSnameFor(ENSNameVariant.NormalizedWithAvatar) },
};

export const EnsAvatarForNormalizedENSNameWithoutAvatarPicture: Story = {
  args: { name: getENSnameFor(ENSNameVariant.NormalizedWithoutAvatar) },
};

export const EnsAvatarForUnnormalizedENSName: Story = {
  args: { name: getENSnameFor(ENSNameVariant.Unnormalized) },
};

export const EnsAvatarForUnknownENSName: Story = {
  args: { name: getENSnameFor(ENSNameVariant.Unknown) },
};

export const LoadingEnsAvatar: Story = {
  args: { name: null },
};
