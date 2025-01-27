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

export function RankForm() {
  const [inputValue, setInputValue] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    analyzeLabel,
    initialState,
  );

  useEffect(() => {
    if (inputValue) {
      if (inputValue.includes(".")) {
        setClientError("Enter only 1 label (no '.')");
      } else {
        try {
          ens_normalize(inputValue);
          setClientError(null);
        } catch (error) {
          setClientError("Please enter a valid ENS label value");
        }
      }
    } else {
      setClientError(null);
    }
  }, [inputValue]);

  const isSubmitDisabled =
    isPending || !!clientError || inputValue.trim() === "";

  return (
    <>
      <form action={formAction} className="mb-6">
        <div className="flex items-center justify-center space-x-2 flex-1">
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
          />
          <Button type="submit" disabled={isSubmitDisabled}>
            {isPending ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
        {clientError && <p className="text-red-500 mt-2">{clientError}</p>}
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>

      {isPending && <Skeleton label={inputValue} />}

      {!isPending && state.success && state.label && state.analysis && (
        <Results analysis={state.analysis} />
      )}
    </>
  );
}
