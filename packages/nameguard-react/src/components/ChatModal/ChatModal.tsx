import React, { forwardRef, type Ref } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

import { Slideover } from "../Slideover/Slideover";

export const xmtpChatUrl =
  "https://xmtp.chat/dm/0x4dC96AAd2Daa3f84066F3A00EC41Fd1e88c8865A";
export const converseUrl = "https://getconverse.app/";
export const coinbaseWalletUrl = "https://www.coinbase.com/wallet";

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
            {/* <Image
                    src={Avatars}
                    role="presentation"
                    alt="Avatars"
                    className="h-10 w-auto mx-auto"
                  /> */}
            <div className="space-y-2">
              <p className="text-black font-semibold text-lg leading-6">
                Contact nameguard.eth using XMTP
              </p>
              <p className="text-gray-400 leading-5 text-sm">
                We&apos;re happy to hear your feedback
              </p>
            </div>
            <a
              href={xmtpChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-black border border-black text-white px-5 py-2 font-medium leading-6 inline-flex items-center space-x-3 transition hover:border-gray-900 hover:bg-gray-900"
            >
              <span>Open XMTP.chat</span>
              <ArrowTopRightOnSquareIcon className="w-5 h-5 fill-current" />
            </a>
            <p className="text-gray-400 leading-5 text-sm">OR</p>
            <p className="text-gray-400 leading-6 text-sm">
              You can contact us using any XMTP chat app, including: <br />
              <a
                href={coinbaseWalletUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black"
              >
                Coinbase Wallet
              </a>
              <span className="text-black">&nbsp;and&nbsp;</span>
              <a
                href={converseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black"
              >
                Converse
              </a>
            </p>
          </div>
        </div>
      </Slideover>
    );
  }
);
