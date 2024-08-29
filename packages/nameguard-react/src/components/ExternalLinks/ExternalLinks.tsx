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
    <Menu as="div" className="relative inline-block text-left group">
      <Tooltip
        trigger={
          <Menu.Button className="flex items-center justify-between p-2 appearance-none bg-transparent hover:bg-black/5 transition rounded-md focus:outline-none">
            <EllipsisVerticalIcon className="text-black fill-current w-6 h-6" />
          </Menu.Button>
        }
      >
        More actions
      </Tooltip>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-44 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
          {title && (
            <div className="text-gray-500 text-sm px-4 py-2.5 border-b border-gray-100 mb-1">
              {title}
            </div>
          )}
          {links.map((link) => (
            <Menu.Item key={link.href} disabled={link.isDisabled}>
              {({ active }) => (
                <a
                  className={`${
                    active ? "bg-gray-100" : ""
                  } text-black group flex space-x-1 w-full items-center px-4 py-2.5 text-sm last:rounded-b-md`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.text}</span>
                  <ArrowUpRightIcon className="fill-current w-3 h-3" />
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
