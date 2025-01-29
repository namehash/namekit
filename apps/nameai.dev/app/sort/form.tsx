"use client";

import { FormEvent } from "react";
import { Input, Button } from "@namehash/namekit-react";

type FormProps = {
  onSubmit: (label: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  clientError: string | null;
  isSubmitDisabled: boolean;
  isPending: boolean;
};

export function Form({
  onSubmit,
  inputValue,
  setInputValue,
  clientError,
  isSubmitDisabled,
  isPending,
}: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-start justify-center space-x-2 flex-1">
        <Input
          type="text"
          name="label"
          placeholder="Enter a label"
          className="ens-webfont flex-1"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
          error={clientError ?? ""}
        />
        <Button type="submit" disabled={isSubmitDisabled} className="!py-1.5">
          {isPending ? "..." : "Sort"}
        </Button>
      </div>
    </form>
  );
}
