"use client";

import { FormEvent, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Input, Button } from "@namehash/namekit-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      // className="bg-black text-white px-6 py-3 rounded flex-shrink-0 border border-black"
      disabled={pending}
    >
      {pending ? "Working..." : "Go"}
    </Button>
  );
}

type FormProps = {
  initialValue?: string;
  onSubmit: (name: string) => void;
};

export function Form({ initialValue = "", onSubmit }: FormProps) {
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const label = formData.get("label") as string;

    try {
      onSubmit(label);
      if (formRef.current) formRef.current.reset();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="mb-6">
      <div className="flex items-center justify-center space-x-2 flex-1">
        <Input
          type="text"
          name="label"
          placeholder="Add a label"
          // className="border p-3 mr-2 w-full ens-webfont rounded"
          className="ens-webfont flex-1"
          required
          defaultValue={initialValue}
          autoComplete="off"
          data-1p-ignore
        />
        <SubmitButton />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
