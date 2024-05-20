"use client";

import { useEffect } from "react";
// @ts-ignore
import { getCalApi } from "@calcom/embed-react";
import { Button as UIButton } from "@ui/button";

export const CalButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
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
    <UIButton
      variant="secondary"
      size="medium"
      data-cal-link="namehashlabs/nameguard"
      data-cal-config='{"layout":"month_view"}'
      {...props}
    >
      {children}
    </UIButton>
  );
};
