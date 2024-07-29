"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export const CalButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        cssVarsPerTheme: {
          light: {
            "--brand-color": "#000000",
          },
          dark: {
            "--brand-color": "#000000",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <button
      data-cal-link="namehashlabs/namehashlabs"
      data-cal-config='{"layout":"month_view"}'
      {...props}
    >
      {children}
    </button>
  );
};
