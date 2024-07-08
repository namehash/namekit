import { DomainCard } from "@namehash/ens-utils";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { DisplayedName } from "./DisplayedName";
import cc from "classcat";
import { Link } from "./Link";
import { OwnerIcon } from "./icons/OwnerIcon";
import { ThreeVerticalDotsIcon } from "./icons/ThreeVerticalDotsIcon";
import { BottomDrawer } from "./BottomDrawer";
import { Transition } from "@headlessui/react";

export const IS_MOBILE_THRESHOLD = 768;

const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <div className="nk-h-12 md:nk-h-10 nk-w-full nk-flex nk-items-center nk-justify-between md:hover:nk-bg-black md:hover:nk-bg-opacity-5 nk-cursor-pointer nk-transition nk-duration-200">
    {children}
  </div>
);

interface DomainMenuProps {
  domainCard: DomainCard | null; // when null we show the skeleton
}

export const DomainMenu = ({ domainCard }: DomainMenuProps) => {
  const domainMenuRef = useRef<any>();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(
        window.matchMedia(`(max-width: ${IS_MOBILE_THRESHOLD}px)`).matches,
      );
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(
          window.matchMedia(`(max-width: ${IS_MOBILE_THRESHOLD}px)`).matches,
        );
      });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isMobile) return;
      if (
        domainMenuRef.current &&
        !domainMenuRef.current.contains(event.target)
      ) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  if (domainCard === null) return <div className="nk-w-10 nk-h-10" />;

  const textSize = isMobile ? "nk-text-md" : "nk-text-sm";
  const menuItems = (
    <>
      {!!domainCard.ownerAddress && (
        <MenuItem>
          <Link
            target="_blank"
            variant="secondary"
            href={`https://app.ens.domains/${domainCard.ownerAddress}`}
            className={cc([
              "nk-flex nk-items-center nk-space-x-3 nk-text-black nk-pl-5 nk-w-full nk-h-full",
              textSize,
            ])}
          >
            <OwnerIcon />
            <span>View owner</span>
          </Link>
        </MenuItem>
      )}

      {!!domainCard.formerOwnerAddress && (
        <MenuItem>
          <Link
            href={`/0x/${domainCard.formerOwnerAddress}`}
            className={cc([
              "nk-flex nk-items-center nk-space-x-3 nk-text-black nk-pl-5 nk-w-full nk-h-full",
              textSize,
            ])}
          >
            <OwnerIcon />
            <span>View former owner</span>
          </Link>
        </MenuItem>
      )}
    </>
  );

  return (
    <div ref={domainMenuRef} onClick={(e) => e.stopPropagation()}>
      <button
        className={cc([
          "nk-flex nk-h-10 nk-w-10 nk-appearance-none nk-items-center nk-justify-center nk-rounded-lg nk-transition nk-bg-black nk-bg-opacity-0 hover:nk-bg-opacity-5 nk-outline-none",
        ])}
        onClick={(e) => {
          e.preventDefault();
          setMenuIsOpen(!menuIsOpen);
        }}
      >
        <ThreeVerticalDotsIcon className="nk-w-1 nk-stroke-current nk-text-black" />
      </button>
      <BottomDrawer
        isOpen={menuIsOpen && isMobile}
        setIsOpen={setMenuIsOpen}
        drawerContent={
          <div className="nk-flex nk-flex-col">
            <div className="nk-flex nk-flex-row nk-justify-between nk-items-center nk-space-x-2 nk-p-5">
              <div className="nk-flex nk-flex-row nk-items-center nk-space-x-2">
                <DisplayedName
                  name={domainCard.name || null} // when null we show a skeleton
                />
              </div>
            </div>

            <div className="nk-flex nk-flex-col nk-border-t nk-border-gray-200 nk-py-3">
              {menuItems}
            </div>
          </div>
        }
      />
      <Transition
        show={menuIsOpen && !isMobile}
        as={Fragment}
        enter="nk-transition nk-ease-out nk-duration-100"
        enterFrom="nk-transform nk-opacity-0 nk-scale-95"
        enterTo="nk-transform nk-opacity-100 nk-scale-100"
        leave="nk-transition nk-ease-in nk-duration-75"
        leaveFrom="nk-transform nk-opacity-100 nk-scale-100"
        leaveTo="nk-transform nk-opacity-0 nk-scale-95"
      >
        <div
          className="nk-absolute nk-right-0 nk-z-20 nk-mt-1.5 nk-w-64 nk-origin-top-right nk-rounded-md nk-bg-white nk-shadow-lg nk-ring-1 nk-ring-black nk-ring-opacity-5 focus:nk-outline-none nk-py-2"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setMenuIsOpen(false);
          }}
        >
          {menuItems}
        </div>
      </Transition>
    </div>
  );
};
