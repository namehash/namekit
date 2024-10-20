"use client";

import { useEffect } from "react";
// @ts-ignore
import { getCalApi } from "@calcom/embed-react";
import { Button, ButtonProps } from "@namehash/namekit-react";

interface CalendarButtonProps extends ButtonProps {
  link: string;
}

export const CalendarButton = ({
  children,
  link,
  ...props
}: CalendarButtonProps) => {
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
      data-cal-link={link}
      data-cal-config='{"layout":"month_view"}'
      {...props}
    >
      {children}
    </Button>
  );
};
