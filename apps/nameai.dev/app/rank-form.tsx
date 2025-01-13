"use client";

import { useRouter } from "next/navigation";
import { Form } from "./form";

interface FormContainerProps {
  initialName: string;
}

export function RankForm({ initialName }: FormContainerProps) {
  const router = useRouter();

  const handleSubmit = (submittedName: string) => {
    router.push(`/?name=${encodeURIComponent(submittedName)}`);
  };

  return <Form initialName={initialName} onSubmit={handleSubmit} />;
}
