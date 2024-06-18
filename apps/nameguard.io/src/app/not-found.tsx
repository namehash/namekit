import type { Metadata } from "next";
import NotFound from "./components/organisms/NotFound";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function Page() {
  return <NotFound />;
}
