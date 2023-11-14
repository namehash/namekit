/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";

type AvatarProps = {
  address: string;
  name: string | null;
};

export function Avatar({ address, name }: AvatarProps) {
  const [isLoadingENS, setIsLoadingENS] = useState(false);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [errorLoadingENS, setErrorLoadingENS] = useState(false);

  useEffect(() => {
    if (name) {
      setIsLoadingENS(true);
      fetch(`https://metadata.ens.domains/mainnet/avatar/${name}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load ENS avatar");
          }
          return response.url;
        })
        .then((data) => {
          setEnsAvatar(data);
          setIsLoadingENS(false);
        })
        .catch(() => {
          setErrorLoadingENS(true);
          setIsLoadingENS(false);
        });
    }
  }, [name]);

  if (isLoadingENS) {
    return (
      <div className="min-w-[40px] max-w-[40px] h-[40px] rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse"></div>
    );
  }

  if (name && ensAvatar && !errorLoadingENS) {
    return (
      <img
        src={ensAvatar}
        className="min-w-[40px] max-w-[40px] h-[40px] rounded-full"
        alt={name}
      />
    );
  }

  return (
    <img
      src={`https://effigy.im/a/${address}.png`}
      className="min-w-[40px] max-w-[40px] h-[40px] rounded-full"
      alt={address}
    />
  );
}
