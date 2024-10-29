import NotFound from "@/components/organisms/NotFound";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function Page() {
  return <NotFound />;
}
