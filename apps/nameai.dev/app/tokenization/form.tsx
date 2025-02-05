"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Input, Button } from "@namehash/namekit-react";
import { ens_normalize } from "@adraffy/ens-normalize";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { analyzeLabel } from "./actions";
import { Results } from "./results";
import { Skeleton } from "../skeleton";
import { QuickSearch } from "../quicksearch";

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
  const [normalizedLabel, setNormalizedLabel] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (inputValue) {
      params.set("label", inputValue);
    } else {
      params.delete("label");
    }
    router.replace(`/tokenization?${params.toString()}`);
  }, [inputValue, router, searchParams]);

  const handleExampleClick = (example: string) => {
    setInputValue(example);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 0);
  };

  useEffect(() => {
    if (inputValue) {
      let error = null;
      let normalized = "";

      if (inputValue.includes(" ")) {
        error = "Remove spaces from the label";
      } else if (inputValue.includes(".")) {
        error = "Enter only 1 label (no '.')";
      } else {
        try {
          normalized = ens_normalize(inputValue);
          setNormalizedLabel(normalized);
          setClientError(null);
        } catch (error) {
          error = "Enter a valid ENS label value";
        }
      }

      setClientError(error);
    } else {
      setClientError(null);
      setNormalizedLabel("");
    }
  }, [inputValue]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  useEffect(() => {
    if (initialValue && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [initialValue]);

  return (
    <>
      <form ref={formRef} action={formAction} className="mb-6">
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
          <Button type="submit" className="!py-1.5" loading={isPending}>
            Analyze
          </Button>
        </div>
      </form>

      <div className="mb-8">
        <QuickSearch handleClick={handleExampleClick} />
      </div>

      {isPending && <Skeleton label={normalizedLabel} />}

      {!isPending && state.success && state.label && state.analysis && (
        // @ts-expect-error
        <Results analysis={state.analysis} />
      )}
    </>
  );
}
