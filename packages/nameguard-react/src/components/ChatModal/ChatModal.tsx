import React, { forwardRef, type Ref } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

import { AvatarIcons } from "./Avatars";
import { Slideover } from "../Slideover/Slideover";

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
        <div className="ng-flex ng-items-center ng-justify-center ng-h-full ng-py-12">
          <div className="ng-space-y-5 ng-text-center">
            <AvatarIcons className="ng-h-[49px] ng-w-auto ng-mx-auto" />
            <div className="ng-space-y-2">
              <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-6">
                Contact nameguard.eth using XMTP
              </p>
              <p className="ng-text-gray-400 ng-leading-5 ng-text-sm">
                We&apos;re happy to hear your feedback
              </p>
            </div>
            <a
              href={xmtpChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ng-rounded-md ng-bg-black ng-border ng-border-black ng-text-white ng-px-5 ng-py-2 ng-font-medium ng-leading-6 ng-inline-flex ng-items-center ng-space-x-3 ng-transition hover:ng-border-gray-900 hover:ng-bg-gray-900"
            >
              <span>Open XMTP.chat</span>
              <ArrowTopRightOnSquareIcon className="ng-w-5 ng-h-5 ng-fill-current" />
            </a>
            <p className="ng-text-gray-400 ng-leading-5 ng-text-sm">OR</p>
            <p className="ng-text-gray-400 ng-leading-6 ng-text-sm">
              You can contact us using any XMTP chat app, including: <br />
              <a
                href={coinbaseWalletUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:hover:ng-underline-offset-[2px] ng-text-black"
              >
                Coinbase Wallet
              </a>
              <span className="ng-text-black">&nbsp;and&nbsp;</span>
              <a
                href={converseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:hover:ng-underline-offset-[2px] ng-text-black"
              >
                Converse
              </a>
            </p>
          </div>
        </div>
      </Slideover>
    );
  },
);
