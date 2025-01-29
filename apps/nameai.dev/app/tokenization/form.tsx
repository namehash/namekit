"use client";

import { useActionState, useState, useEffect } from "react";
import { Input, Button } from "@namehash/namekit-react";
import { ens_normalize } from "@adraffy/ens-normalize";

import { analyzeLabel } from "./actions";
import { Results } from "./results";
import { Skeleton } from "../skeleton";

type ActionState = {
  error?: string;
  success?: boolean;
  label?: string;
  analysis?: any;
};

const initialState: ActionState = {
  error: "",
  success: false,
  label: "",
  analysis: null,
};

export function Form({ initialValue }: { initialValue?: string }) {
  const [inputValue, setInputValue] = useState(initialValue ?? "");
  const [clientError, setClientError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    analyzeLabel,
    initialState,
  );

  useEffect(() => {
    if (inputValue) {
      let error = null;

      if (inputValue.includes(" ")) {
        error = "Remove spaces from the label";
      } else if (inputValue.includes(".")) {
        error = "Enter only 1 label (no '.')";
      } else {
        try {
          ens_normalize(inputValue);
          setClientError(null);
        } catch (error) {
          error = "Enter a valid ENS label value";
        }
      }

      setClientError(error);
    } else {
      setClientError(null);
    }
  }, [inputValue]);

  const isSubmitDisabled =
    isPending || !!clientError || inputValue.trim() === "";

  return (
    <>
      <form action={formAction} className="mb-6">
        <div className="flex items-start justify-center space-x-2 flex-1">
          <Input
            type="text"
            name="label"
            placeholder="Add a label"
            className="ens-webfont flex-1"
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoComplete="off"
            data-1p-ignore
            error={clientError ?? ""}
          />
          <Button type="submit" disabled={isSubmitDisabled} className="!py-1.5">
            {isPending ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </form>

      {isPending && <Skeleton label={inputValue} />}

      {!isPending && state.success && state.label && state.analysis && (
        // @ts-expect-error
        <Results analysis={state.analysis} />
      )}
    </>
  );
}
