import React, { forwardRef, type Ref } from "react";
import useSWR from "swr";
import { type GraphemeGuardReport, nameguard } from "@namehash/nameguard";

import { useGraphemeModalStore } from "../../stores/grapheme";
import { Slideover } from "../Slideover/Slideover";

export const GraphemeModal = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  const { isGraphemeModalOpen, closeGraphemeModal, currentGrapheme } =
    useGraphemeModalStore();

  const { data, isLoading } = useSWR<GraphemeGuardReport>(
    currentGrapheme,
    (g: string) => nameguard.inspectGrapheme(g)
  );

  return (
    <Slideover
      title={currentGrapheme}
      isOpen={isGraphemeModalOpen}
      onClose={closeGraphemeModal}
      ref={ref}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </Slideover>
  );
});
