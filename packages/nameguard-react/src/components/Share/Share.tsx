import React, { useState, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

import { toast } from "sonner";

import cc from "classcat";
import { Tooltip } from "../Tooltip/Tooltip";
import { viewNameReportURL } from "../../utils/url";
import { CheckResultCode } from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";
import { DisplayedName } from "../DisplayedName/DisplayedName";
import { buildENSName } from "@namehash/ens-utils";

type ShareProps = {
  name: string;
};

function createTwitterLink(name: string) {
  const tweetText = `Check out the NameGuard Report for ${name}\n`;
  const url = viewNameReportURL(buildENSName(name)).href;

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText,
  )}&url=${encodeURIComponent(url)}`;
}

function createTelegramLink(url: string) {
  const urlEncoded = encodeURIComponent(url);

  return `https://t.me/share/url?url=${urlEncoded}`;
}

function createMailToLink(subject, body) {
  const subjectEncoded = encodeURIComponent(subject);
  const bodyEncoded = encodeURIComponent(body);

  return `mailto:?subject=${subjectEncoded}&body=${bodyEncoded}`;
}

export function Share({ name }: ShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const twitterLink = createTwitterLink(name);
  const telegramLink = createTelegramLink(
    viewNameReportURL(buildENSName(name)).href,
  );
  const emailLink = createMailToLink(
    `NameGuard Report for ${name}`,
    `Check this out!\n${viewNameReportURL(buildENSName(name)).href}`,
  );
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(viewNameReportURL(buildENSName(name)).href);
    toast.success("Link copied to clipboard", {
      icon: (
        <CheckCircleIcon
          className={cc([
            "w-5 h-5",
            checkResultCodeTextColor(CheckResultCode.pass),
          ])}
        />
      ),
    });
    closeModal();
  };

  const closeModal = () => setIsOpen(false);

  return (
    <Fragment>
      <Tooltip
        trigger={
          <button
            className="flex items-center justify-between p-2 appearance-none bg-transparent hover:bg-black/5 transition rounded-md focus:outline-none"
            onClick={() => setIsOpen(true)}
          >
            <ArrowUpTrayIcon className="text-black fill-current w-6 h-6" />
            <span className="font-medium ml-1.5 text-sm hidden md:inline-block">
              Share
            </span>
          </button>
        }
      >
        Share report
      </Tooltip>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 z-20 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-3"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 translate-y-3"
            >
              <div className="relative z-50 flex items-center justify-center min-h-screen p-6 md:p-0">
                <Dialog.Panel className="w-full md:max-w-sm mx-auto relative transform overflow-scroll rounded-xl bg-white md:bg-gray-100 md:shadow-2xl transition-all flex flex-col">
                  <div className="h-[56px] md:h-[68px] flex items-center md:justify-start px-6 pb-3 md:pb-0 pt-3 md:pt-2 text-center relative">
                    <Dialog.Title className="font-medium text-lg">
                      Share NameGuard report
                    </Dialog.Title>
                    <div className="flex items-center right-0 inset-y-0 absolute pr-6 z-20">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 -mr-3 appearance-none bg-transparent hover:bg-black/5 transition rounded-md"
                      >
                        <XMarkIcon className="w-6 h-6 fill-current text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="min-h-[200px] flex items-center justify-center px-6 md:px-10">
                    {name && (
                      <DisplayedName
                        name={buildENSName(name)}
                        textStylingClasses="font-extrabold text-black text-xl"
                      />
                    )}
                  </div>

                  <div className="bg-white px-6 py-6 flex flex-wrap justify-between">
                    <a
                      href={twitterLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex flex-col space-y-3 items-center group"
                      onClick={closeModal}
                    >
                      <div className="rounded-full bg-gray-100 h-10 w-10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          className="fill-current text-gray-400 group-hover:text-gray-900"
                        >
                          <path d="M13.5222 10.7749L19.4785 4H18.0671L12.8952 9.88256L8.76437 4H4L10.2466 12.8955L4 20H5.41155L10.8732 13.7878L15.2356 20H20L13.5218 10.7749H13.5222ZM11.5889 12.9738L10.956 12.0881L5.92015 5.03974H8.0882L12.1522 10.728L12.7851 11.6137L18.0677 19.0075H15.8997L11.5889 12.9742V12.9738Z" />
                        </svg>
                      </div>
                      <span className="text-black text-xs">X.com</span>
                    </a>
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex flex-col space-y-3 items-center group"
                      onClick={closeModal}
                    >
                      <div className="rounded-full bg-gray-100 h-10 w-10 flex items-center justify-center">
                        <svg
                          width="18"
                          height="14"
                          viewBox="0 0 18 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current text-gray-400 group-hover:text-gray-900"
                        >
                          <path d="M17.2996 0.613336C17.2861 0.55362 17.2566 0.498428 17.214 0.453345C17.1715 0.408262 17.1174 0.374889 17.0573 0.356605C16.8383 0.314524 16.6117 0.330113 16.4011 0.401752C16.4011 0.401752 1.79852 5.49528 0.964549 6.05928C0.785394 6.18057 0.724981 6.25132 0.695121 6.3342C0.550686 6.7385 0.999963 6.91235 0.999963 6.91235L4.76361 8.10235C4.82725 8.11343 4.89269 8.10973 4.95457 8.09157C5.81007 7.56665 13.5651 2.81274 14.0158 2.65304C14.0852 2.63282 14.1387 2.65304 14.1248 2.70358C13.9457 3.3134 7.24401 9.09019 7.20721 9.12523C7.18928 9.13948 7.17531 9.15786 7.16658 9.1787C7.15785 9.19953 7.15463 9.22215 7.15721 9.2445L6.80584 12.8104C6.80584 12.8104 6.65863 13.9202 7.80231 12.8104C8.61337 12.0227 9.39179 11.3705 9.78065 11.0531C11.075 11.9203 12.4673 12.8792 13.0679 13.3812C13.169 13.4761 13.2887 13.5502 13.4199 13.5992C13.5512 13.6482 13.6913 13.671 13.8318 13.6662C14.0048 13.6457 14.1674 13.5746 14.2977 13.4623C14.4281 13.35 14.5201 13.2018 14.5616 13.0375C14.5616 13.0375 17.2212 2.64495 17.31 1.25281C17.3191 1.11804 17.3309 1.02909 17.3323 0.93543C17.3366 0.827123 17.3256 0.718752 17.2996 0.613336Z" />
                        </svg>
                      </div>
                      <span className="text-black text-xs">Telegram</span>
                    </a>
                    <a
                      href={emailLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex flex-col space-y-3 items-center group"
                      onClick={closeModal}
                    >
                      <div className="rounded-full bg-gray-100 h-10 w-10 flex items-center justify-center">
                        <svg
                          width="16"
                          height="12"
                          viewBox="0 0 16 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current text-gray-400 group-hover:text-gray-900"
                        >
                          <path d="M0.00300002 1.884L8 5.882L15.997 1.884C15.9674 1.37444 15.7441 0.895488 15.3728 0.545227C15.0016 0.194965 14.5104 -9.35847e-05 14 3.36834e-08H2C1.48958 -9.35847e-05 0.998447 0.194965 0.627178 0.545227C0.255908 0.895488 0.0326041 1.37444 0.00300002 1.884Z" />
                          <path d="M16 4.118L8 8.118L0 4.118V10C0 10.5304 0.210714 11.0391 0.585786 11.4142C0.960859 11.7893 1.46957 12 2 12H14C14.5304 12 15.0391 11.7893 15.4142 11.4142C15.7893 11.0391 16 10.5304 16 10V4.118Z" />
                        </svg>
                      </div>
                      <span className="text-black text-xs">Email</span>
                    </a>
                    <button
                      onClick={copyLinkToClipboard}
                      className="flex flex-col space-y-3 items-center group"
                    >
                      <div className="rounded-full bg-gray-100 h-10 w-10 flex items-center justify-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current text-gray-400 group-hover:text-gray-900"
                        >
                          <path
                            d="M9.99188 6.24035C10.3661 6.4191 10.7167 6.66343 11.0267 6.97335C12.4911 8.43782 12.4911 10.8122 11.0267 12.2766L7.27665 16.0267C5.81218 17.4911 3.43782 17.4911 1.97335 16.0267C0.508883 14.5622 0.508883 12.1878 1.97335 10.7234L3.43749 9.25921M14.5625 8.74079L16.0267 7.27665C17.4911 5.81218 17.4911 3.43782 16.0267 1.97335C14.5622 0.508883 12.1878 0.508883 10.7234 1.97335L6.97335 5.72335C5.50888 7.18782 5.50888 9.56219 6.97335 11.0267C7.28327 11.3366 7.63394 11.5809 8.00812 11.7597"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-black text-xs">Copy link</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
