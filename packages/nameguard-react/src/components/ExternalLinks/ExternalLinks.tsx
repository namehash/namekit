import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/solid";

import { Tooltip } from "@namehash/namekit-react";

type LinkItem = {
  href: string;
  text: string;
  isDisabled?: boolean;
};

type ExternalLinksProps = {
  title?: string;
  links: LinkItem[];
};

export function ExternalLinks({ title, links }: ExternalLinksProps) {
  return (
    <Menu
      as="div"
      className="ng-relative ng-inline-block ng-text-left ng-group"
    >
      <Tooltip
        trigger={
          <Menu.Button className="ng-flex ng-items-center ng-justify-between ng-p-2 ng-appearance-none ng-bg-transparent hover:ng-bg-black/5 ng-transition ng-rounded-md focus:ng-outline-none">
            <EllipsisVerticalIcon className="ng-text-black ng-fill-current ng-w-6 ng-h-6" />
          </Menu.Button>
        }
      >
        More actions
      </Tooltip>

      <Transition
        as={Fragment}
        enter="ng-transition ng-ease-out ng-duration-100"
        enterFrom="ng-transform ng-opacity-0 ng-scale-95"
        enterTo="ng-transform ng-opacity-100 ng-scale-100"
        leave="ng-transition ng-ease-in ng-duration-75"
        leaveFrom="ng-transform ng-opacity-100 ng-scale-100"
        leaveTo="ng-transform ng-opacity-0 ng-scale-95"
      >
        <Menu.Items className="ng-absolute ng-right-0 ng-mt-1 ng-w-44 ng-origin-top-right ng-bg-white ng-rounded-md ng-shadow-lg ng-ring-1 ng-ring-black/5 focus:ng-outline-none">
          {title && (
            <div className="ng-text-gray-500 ng-text-sm ng-px-4 ng-py-2.5 ng-border-b ng-border-gray-100 ng-mb-1">
              {title}
            </div>
          )}
          {links.map((link) => (
            <Menu.Item key={link.href} disabled={link.isDisabled}>
              {({ active }) => (
                <a
                  className={`${
                    active ? "ng-bg-gray-100" : ""
                  } ng-text-black ng-group ng-flex ng-space-x-1 ng-w-full ng-items-center ng-px-4 ng-py-2.5 ng-text-sm last:ng-rounded-b-md`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.text}</span>
                  <ArrowUpRightIcon className="ng-fill-current ng-w-3 ng-h-3" />
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
