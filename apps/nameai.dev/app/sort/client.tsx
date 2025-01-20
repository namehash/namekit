"use client";

import { useState } from "react";
import { nameai } from "@namehash/nameai";

import { Form } from "../form";
import { SortedList } from "./list";
import type { LabelItem } from "./page";

export function Client({ initialLabels }: { initialLabels: LabelItem[] }) {
  const [labels, setLabels] = useState(initialLabels);

  const handleSubmit = async (label: string) => {
    try {
      const labelExists = labels.some(
        (item) => item.label.toLowerCase() === label.toLowerCase(),
      );

      if (!labelExists) {
        const result = await nameai.inspectName(label);
        const newLabelItem = {
          label,
          sortScore: result.nameai.sort_score,
        };
        setLabels((prevLabels) => {
          const updatedLabels = [...prevLabels, newLabelItem];
          return updatedLabels.sort(
            (a, b) => b.sortScore - a.sortScore,
          );
        });
      } else {
        console.log("Label already exists");
      }
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} />
      <SortedList labels={labels} />
    </>
  );
}
