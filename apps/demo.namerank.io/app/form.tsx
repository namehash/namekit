"use client";

import { FormEvent, useRef } from "react";
import { useFormStatus } from "react-dom";
import { analyzeNameRank } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded"
      disabled={pending}
    >
      {pending ? "Analyzing..." : "Analyze"}
    </button>
  );
}

export function Form() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    await analyzeNameRank(name);

    formRef.current?.reset();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="mb-4">
      <input
        type="text"
        name="name"
        placeholder="Enter a name"
        className="border p-2 mr-2"
        required
      />
      <SubmitButton />
    </form>
  );
}
