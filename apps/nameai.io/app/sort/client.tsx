"use client";

import { useState, useEffect } from "react";
import { nameai } from "@namehash/nameai";
import { ens_normalize } from "@adraffy/ens-normalize";
import { toast } from "sonner";
import { Form } from "./form";
import { SortedList } from "./list";
import type { LabelItem } from "./page";

export function Client({
  initialLabels = [],
}: {
  initialLabels?: LabelItem[];
}) {
  const [labels, setLabels] = useState(initialLabels);
  const [inputValue, setInputValue] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
        } catch (error) {
          error = "Enter a valid ENS label value";
        }
      }

      setClientError(error);
    } else {
      setClientError(null);
    }
  }, [inputValue]);

  const handleSubmit = async (label: string) => {
    if (clientError) return;

    setIsPending(true);
    try {
      const normalizedLabel = ens_normalize(label);
      const existingLabelIndex = labels.findIndex(
        (item) => item.label.toLowerCase() === normalizedLabel.toLowerCase(),
      );

      if (existingLabelIndex !== -1) {
        toast.error(
          `'${normalizedLabel}' already AI sorted to position ${existingLabelIndex + 1}.`,
        );
      } else {
        const result = await nameai.inspectName(normalizedLabel);
        const newLabelItem = {
          label: normalizedLabel,
          sortScore: result.nameai.sort_score,
        };

        const updatedLabels = [...labels, newLabelItem].sort(
          (a, b) => b.sortScore - a.sortScore,
        );
        const newPosition =
          updatedLabels.findIndex((item) => item.label === normalizedLabel) + 1;

        setLabels(updatedLabels);
        setInputValue("");

        toast.success(
          `AI sorted '${normalizedLabel}' to position ${newPosition}.`,
        );
      }
    } catch (error) {
      console.error("Error adding label:", error);
      setClientError("Could not add label.");
      toast.error("Could not add label.");
    } finally {
      setIsPending(false);
    }
  };

  const isSubmitDisabled =
    isPending || !!clientError || inputValue.trim() === "";

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        clientError={clientError}
        isSubmitDisabled={isSubmitDisabled}
        isPending={isPending}
      />
      <SortedList labels={labels} />
    </>
  );
}
