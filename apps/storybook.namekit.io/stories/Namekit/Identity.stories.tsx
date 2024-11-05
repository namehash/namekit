import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Identity,
  NameKitProvider,
  ProfileLinkGenerator,
} from "@namehash/namekit-react/client";

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

const TwitterProfileLink = new ProfileLinkGenerator(
  "Twitter",
  "https://twitter.com/",
);
const GitHubProfileLink = new ProfileLinkGenerator(
  "GitHub",
  "https://github.com/",
);

const DefaultIdentityCard: React.FC<{
  address: string;
  network?: "mainnet" | "sepolia";
  returnNameGuardReport?: boolean;
}> = ({ address, network, returnNameGuardReport }) => (
  <Identity.Root
    address={address}
    network={network}
    returnNameGuardReport={returnNameGuardReport}
  >
    <Identity.Avatar />
    <Identity.Name />
    <Identity.Address />
    <Identity.NameGuardShield />
    <Identity.ProfileLink>
      <div>
        <ENSLogo />
        <span>View on ENS App</span>
      </div>
    </Identity.ProfileLink>
    <Identity.Followers />
  </Identity.Root>
);

const CustomAppIdentityCard: React.FC<{ address: string }> = ({ address }) => (
  <NameKitProvider
    config={{ profileLinks: [TwitterProfileLink, GitHubProfileLink] }}
  >
    <Identity.Root address={address}>
      <Identity.Avatar />
      <Identity.Name />
      <Identity.ProfileLink>
        <button>View Profile</button>
      </Identity.ProfileLink>
    </Identity.Root>
  </NameKitProvider>
);

const ModalIdentityCard: React.FC<{ address: string }> = ({ address }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dialogRef.current?.showModal();
  };

  return (
    <NameKitProvider
      config={{ profileLinks: [new ProfileLinkGenerator("Modal", "#")] }}
    >
      <Identity.Root address={address}>
        <Identity.Avatar />
        <Identity.Name />
        <Identity.ProfileLink onClick={handleClick}>
          <>
            <span>Open Profile Modal</span>
            <span>→</span>
          </>
        </Identity.ProfileLink>
      </Identity.Root>
      <dialog ref={dialogRef}>
        Hello {address}
        <button onClick={() => dialogRef.current?.close()}>Close</button>
      </dialog>
    </NameKitProvider>
  );
};

export const Default: Story = {
  args: {
    address: "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9",
    network: "mainnet",
    className: "rounded-xl",
  },
  render: (args) => <DefaultIdentityCard {...args} />,
};

export const MultipleCards: Story = {
  render: () => (
    <>
      <DefaultIdentityCard address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9" />
      <DefaultIdentityCard address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" />
      <DefaultIdentityCard address="0xf81bc66316a3f2a60adc258f97f61dfcbdd23bb1" />
    </>
  ),
};

export const ProfileLinkVariants: Story = {
  render: () => {
    const address = "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9";

    return (
      <div className="nk-space-y-8">
        <div>
          <h3>Default ENS App Link</h3>
          <Identity.Root address={address}>
            <Identity.Avatar />
            <Identity.Name />
            <Identity.ProfileLink>
              <div className="nk-flex nk-items-center nk-gap-2">
                <ENSLogo />
                <span>View on ENS App</span>
              </div>
            </Identity.ProfileLink>
          </Identity.Root>
        </div>

        <div>
          <h3>Custom App Link</h3>
          <NameKitProvider
            config={{ profileLinks: [TwitterProfileLink, GitHubProfileLink] }}
          >
            <Identity.Root address={address}>
              <Identity.Avatar />
              <Identity.Name />
              <Identity.ProfileLinks />
            </Identity.Root>
          </NameKitProvider>
        </div>

        <div>
          <h3>Modal Link</h3>
          <ModalIdentityCard address={address} />
        </div>
      </div>
    );
  },
};

const ENSLogo = () => (
  <svg
    fill="none"
    height="16"
    viewBox="0 0 202 231"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#0080bc">
      <path d="m98.3592 2.80337-63.5239 104.52363c-.4982.82-1.6556.911-2.2736.178-5.5924-6.641-26.42692-34.89-.6463-60.6377 23.5249-23.4947 53.4891-40.24601 64.5942-46.035595 1.2599-.656858 2.587.758365 1.8496 1.971665z" />
      <path d="m94.8459 230.385c1.2678.888 2.8299-.626 1.9802-1.918-14.1887-21.581-61.3548-93.386-67.8702-104.165-6.4264-10.632-19.06614-28.301-20.12056-43.4178-.10524-1.5091-2.19202-1.8155-2.71696-.3963-.8466 2.2888-1.74793 5.0206-2.58796 8.1413-10.60469 39.3938 4.79656 81.1968 38.24488 104.6088l53.0706 37.148z" />
      <path d="m103.571 228.526 63.524-104.523c.498-.82 1.656-.911 2.274-.178 5.592 6.64 26.427 34.89.646 60.638-23.525 23.494-53.489 40.246-64.594 46.035-1.26.657-2.587-.758-1.85-1.972z" />
      <path d="m107.154.930762c-1.268-.8873666-2.83.625938-1.98 1.918258 14.189 21.58108 61.355 93.38638 67.87 104.16498 6.427 10.632 19.066 28.301 20.121 43.418.105 1.509 2.192 1.815 2.717.396.846-2.289 1.748-5.02 2.588-8.141 10.604-39.394-4.797-81.1965-38.245-104.609z" />
    </g>
  </svg>
);
