import { DisplayedNameVariant, getENSNameForVariant } from "./mock-utils";
import { DisplayedName } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DisplayedName> = {
  component: DisplayedName,
  title: "Namekit/DisplayedName",
  args: {
    name: getENSNameForVariant(DisplayedNameVariant.SHORT_NAME),
  },
};

export default meta;

type Story = StoryObj<typeof DisplayedName>;

export const ShortName: Story = {
  args: {
    name: getENSNameForVariant(DisplayedNameVariant.SHORT_NAME),
  },
};
export const ShortNameStyled: Story = {
  args: {
    textStylingClasses: "nk-underline",
    name: getENSNameForVariant(DisplayedNameVariant.SHORT_NAME),
  },
};
export const LongName: Story = {
  args: {
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const LongNameStyled: Story = {
  args: {
    textStylingClasses: "nk-underline",
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const DefaultTooltipStyles: Story = {
  args: {
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const CustomTooltipStyles: Story = {
  args: {
    tooltipTextStylingClasses: "nk-underline",
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const SmallMaxTooltipWidth: Story = {
  args: {
    maxTooltipWidth: 100,
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const BigMaxTooltipWidth: Story = {
  args: {
    maxTooltipWidth: 600,
    name: getENSNameForVariant(DisplayedNameVariant.LONG_NAME),
  },
};
export const WithoutTooltip: Story = {
  args: {
    displayTooltipWhenNameOverflows: false,
    name: getENSNameForVariant(DisplayedNameVariant.WITHOUT_TOOLTIP),
  },
};
export const DisplayUnnormalizedName: Story = {
  args: {
    displayUnnormalizedNames: true,
    name: getENSNameForVariant(DisplayedNameVariant.DISPLAY_UNNORMALIZED_NAMES),
  },
};
export const DoNotDisplayUnnormalizedName: Story = {
  args: {
    displayUnnormalizedNames: false,
    name: getENSNameForVariant(DisplayedNameVariant.DISPLAY_UNNORMALIZED_NAMES),
  },
};
export const SmallDisplayWidth: Story = {
  args: {
    maxDisplayWidth: 60,
    name: getENSNameForVariant(DisplayedNameVariant.SHORT_MAX_WIDTH),
  },
};
export const LongDisplayWidth: Story = {
  args: {
    maxDisplayWidth: 600,
    name: getENSNameForVariant(DisplayedNameVariant.SHORT_MAX_WIDTH),
  },
};
