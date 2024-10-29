/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { EnsIcon } from "../1 - atoms/icons/ens-icon";
import { FastAverageColor } from "fast-average-color";
import { useEffect, useRef, useState } from "react";

interface MemberProps {
  name: string;
  role: string;
}

const DEFAULT_AVATAR_SHADOW = "rgba(0, 0, 0, 0.4)";

export const TeamMemberComponent = (member: MemberProps) => {
  const [shadowColor, setShadowColor] = useState(DEFAULT_AVATAR_SHADOW);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);
  const fac = new FastAverageColor();

  useEffect(() => {
    if (imageRef.current) {
      fac
        .getColorAsync(imageRef.current)
        .then((color) => {
          setShadowColor(color.rgba);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [imageRef]);

  return (
    <div className="flex flex-col gap-3" key={member.name}>
      <a
        href={`https://app.ens.domains/${member.name}`}
        target="_blank"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative lg:max-w-[212px] transition-all duration-300"
        style={{
          borderRadius: "12.31px",
          boxShadow: `0 ${isHovered ? "8px 16px" : "6px 12px"} ${shadowColor}`,
        }}
      >
        <Image
          src={`https://metadata.ens.domains/mainnet/avatar/${member.name}`}
          alt={member.name}
          width={212}
          height={212}
          className="rounded-[12px] w-full border-0"
          ref={imageRef}
        />
        <EnsIcon
          className="absolute top-5 left-5 h-7 w-7 sm:w-auto sm:h-auto"
          style={{
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.5)",
          }}
        />
        <p
          className="sm:text-[19px] text-[13px] font-bold text-white absolute bottom-3 left-5 ens-webfont"
          style={{
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.5)",
          }}
        >
          {member.name}
        </p>
      </a>
      <p className="text-lg leading-7 font-semibold">{member.role}</p>
    </div>
  );
};
