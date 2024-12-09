"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
    <button
      data-cal-link="namehashlabs/namekit"
      data-cal-config='{"layout":"month_view"}'
      {...props}
    >
      {children}
    </button>
  );
}
