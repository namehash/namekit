"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <h1 className="justify-center flex font-bold text-2xl mb-4 mt-12">
        <code> @namehash/nameguard-react </code>&apos;s components documentation
      </h1>

      <nav className="flex flex-col space-y-4 mt-12 pb-40 mx-auto max-w-2xl">
        <Link className="hover:underline" href={"/docs/rating-icon"}>
          {"<RatingIcon />"}
        </Link>
        <Link className="hover:underline" href={"/docs/check-result-code-icon"}>
          {"<CheckResultCodeIcon />"}
        </Link>
        <Link className="hover:underline" href={"/docs/report"}>
          {"<ReportIcon /> and <ReportBadge />"}
        </Link>
        <Link className="hover:underline" href={"/docs/displayed-name"}>
          {"<TruncatedText /> and <DisplayedName />"}
        </Link>
      </nav>
    </div>
  );
}
