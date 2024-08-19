"use client";

import { useEffect } from "react";
// @ts-ignore
import { getCalApi } from "@calcom/embed-react";
import { Button, ButtonProps } from "@namehash/namekit-react";

export const CalButton = ({ children, ...props }: ButtonProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Button
      data-cal-link="namehashlabs/nameguard"
      data-cal-config='{"layout":"month_view"}'
      {...props}
    >
      {children}
    </Button>
  );
};
