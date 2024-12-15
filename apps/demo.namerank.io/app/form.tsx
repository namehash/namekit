"use client";

import { FormEvent, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { analyzeNameRank } from "./actions";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-black text-white p-3 rounded flex-shrink-0"
      disabled={pending}
    >
      {pending ? "Tokenizing..." : "Tokenize"}
    </button>
  );
}

type FormProps = {
  initialName?: string;
};

export function Form({ initialName = "" }: FormProps) {
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    try {
      await analyzeNameRank(name);
      router.push(`/?name=${encodeURIComponent(name)}`);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="mb-6">
      <div className="flex items-center">
        <input
          type="text"
          name="name"
          placeholder="Enter a name"
          className="border p-3 mr-2 w-full"
          required
          defaultValue={initialName}
        />
        <SubmitButton />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
