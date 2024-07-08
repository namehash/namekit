import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface BottomDrawerProps {
  triggerElm?: JSX.Element;
  drawerContent: JSX.Element;
  isOpen?: boolean; // if triggerElm is undefined, this is required as we need to control the drawer open state from a parent component
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>; // required if isOpen is passed
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  triggerElm,
  drawerContent,
  isOpen,
  setIsOpen,
}) => {
  if (triggerElm !== undefined && isOpen !== undefined) {
    throw new Error(
      "You can't pass both triggerElm and isOpen to BottomDrawer, you can either pass triggerElm and control the drawer open state from the component itself or pass isOpen and control the drawer open state from a parent component",
    );
  }
  if (isOpen !== undefined && setIsOpen === undefined) {
    throw new Error(
      "You must pass setIsOpen to BottomDrawer if you pass isOpen",
    );
  }

  const [show, setShow] = useState(false);

  return (
    <div>
      {triggerElm !== undefined && (
        <button onClick={() => setShow(true)}>{triggerElm}</button>
      )}
      <Transition.Root
        show={isOpen === undefined ? show : isOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="nk-fixed nk-inset-0 nk-z-30 nk-overflow-y-auto"
          onClose={() => {
            if (isOpen === undefined) {
              setShow(!show);
            } else if (setIsOpen) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="sm:nk-block sm:nk-p-0 nk-flex nk-min-h-screen nk-items-center nk-justify-center nk-px-4 nk-pt-4 nk-pb-20 nk-text-center">
            <Transition.Child
              as={Fragment}
              enter="nk-ease-out nk-duration-300"
              enterFrom="nk-opacity-0"
              enterTo="nk-opacity-100"
              leave="nk-ease-in nk-duration-200"
              leaveFrom="nk-opacity-100"
              leaveTo="nk-opacity-0"
            >
              <Dialog.Overlay className="nk-fixed nk-inset-0 nk-bg-black/30 nk-backdrop-blur-sm" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="nk-transition nk-ease-out duration-300 nk-transform"
              enterFrom="nk-translate-y-full"
              enterTo="nk-translate-y-0"
              leave="nk-transition nk-ease-in nk-duration-200 nk-transform"
              leaveFrom="nk-translate-y-0"
              leaveTo="nk-translate-y-full"
            >
              <div className="nk-max-w-md nk-fixed nk-overflow-hidden nk-rounded-t-2xl nk-bg-white nk-text-left nk-align-bottom nk-shadow-xl nk-transition-all nk-left-0 nk-bottom-0 nk-right-0 nk-mx-auto">
                {drawerContent}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};
