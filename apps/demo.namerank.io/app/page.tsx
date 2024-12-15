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
  const fullName = searchParams?.name || "lightwalker";
  const name = fullName.includes(".") ? fullName.split(".")[0] : fullName;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NameRank</h1>
      <Form />
      <Suspense fallback={<Skeleton />}>
        <Results name={name} />
      </Suspense>
    </div>
  );
}
