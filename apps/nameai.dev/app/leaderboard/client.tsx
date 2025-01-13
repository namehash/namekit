"use client";

import { useState } from "react";
import { nameai } from "@namehash/nameai";

import { Form } from "../form";
import { List } from "./list";

interface NameItem {
  name: string;
  interestingScore: number;
}

export function Client({ initialNames }: { initialNames: NameItem[] }) {
  const [names, setNames] = useState(initialNames);

  const handleSubmit = async (name: string) => {
    try {
      const result = await nameai.inspectName(name);
      const newItem = {
        name,
        interestingScore: result.nameai.interesting_score,
      };
      setNames((prevNames) => {
        const updatedNames = [...prevNames, newItem];
        return updatedNames.sort(
          (a, b) => b.interestingScore - a.interestingScore,
        );
      });
    } catch (error) {
      console.error("Error adding name:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} />
      <List names={names} />
    </>
  );
}
