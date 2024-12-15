import { Suspense } from "react";

import { Form } from "./form";
import Results from "./results";
import { Skeleton } from "./skeleton";

interface HomeProps {
  searchParams?: Promise<{
    name?: string;
  }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const name = searchParams?.name || "";
  const labelForAnalysis = name.includes(".") ? name.split(".")[0] : name;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NameRank</h1>
      <Form initialName={name} />
      {labelForAnalysis && (
        <Suspense fallback={<Skeleton label={labelForAnalysis} />}>
          <Results name={labelForAnalysis} />
        </Suspense>
      )}
    </div>
  );
}
