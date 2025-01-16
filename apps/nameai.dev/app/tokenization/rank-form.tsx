"use client";

import { useRouter } from "next/navigation";

import { Form } from "../form";

interface FormContainerProps {
  initialLabel: string;
}

export function RankForm({ initialLabel }: FormContainerProps) {
  const router = useRouter();

  const handleSubmit = (submittedLabel: string) => {
    router.push(`/tokenization?label=${encodeURIComponent(submittedLabel)}`);
  };

  return <Form initialValue={initialLabel} onSubmit={handleSubmit} />;
}
