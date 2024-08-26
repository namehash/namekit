import React, { forwardRef, type Ref } from "react";

import { AvatarIcons } from "./Avatars";
import { Slideover } from "../Slideover/Slideover";
import { IconButton, Link } from "@namehash/namekit-react";
import { ExternalLinkIcon } from "../icons/externalLinkIcon";

const xmtpChatUrl =
  "https://xmtp.chat/dm/0x91b40c01b12E7f1383E028fA91722fb53C871969";
const converseUrl = "https://getconverse.app/";
const coinbaseWalletUrl = "https://www.coinbase.com/wallet";

type ChatModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ChatModal = forwardRef(
  (props: ChatModalProps, ref: Ref<HTMLDivElement>) => {
    const { open, onClose } = props;

    return (
      <Slideover title="Chat with us" isOpen={open} onClose={onClose} ref={ref}>
        <div className="flex items-center justify-center h-full py-12">
          <div className="space-y-5 text-center">
            <AvatarIcons className="h-[49px] w-[80px] w-auto mx-auto" />
            <div className="space-y-2">
              <p className="text-black font-semibold text-lg leading-6">
                Contact nameguard.eth using XMTP
              </p>
              <p className="text-gray-400 leading-5 text-sm">
                We&apos;re happy to hear your feedback
              </p>
            </div>
            <a
              className="inline-flex"
              href={xmtpChatUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton
                iconPosition="right"
                icon={<ExternalLinkIcon className="w-5 h-5 fill-current" />}
              >
                Open XMTP.chat
              </IconButton>
            </a>
            <p className="text-gray-400 leading-5 text-sm">OR</p>
            <p className="text-gray-400 leading-6 text-sm">
              You can contact us using any XMTP chat app, including: <br />
              <Link
                href={coinbaseWalletUrl}
                target="_blank"
                size="small"
                className="!text-black"
                rel="noopener noreferrer"
                variant="underline"
              >
                Coinbase Wallet
              </Link>
              <span className="text-black">&nbsp;and&nbsp;</span>
              <Link
                href={converseUrl}
                target="_blank"
                size="small"
                className="!text-black"
                rel="noopener noreferrer"
                variant="underline"
              >
                Converse
              </Link>
            </p>
          </div>
        </div>
      </Slideover>
    );
  },
);
