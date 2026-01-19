// import { NameKitPage } from "../components/05-pages";

import { NameKitPage } from "@/components/pages/namekit";

// Force dynamic rendering to avoid SSR issues with browser APIs
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 0;

export default function Home() {
  return (
    <div>
      <NameKitPage />
    </div>
  );
}
