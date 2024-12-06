"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WritersBlockCollection, WritersBlockSuggestion } from "@/lib/utils";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";

interface CatalogProps {
  onJsonChange: (parsedJson: any) => void;
}

export function Catalog({ onJsonChange }: CatalogProps) {
  const [hasJSONFormatError, setHasJSONFormatError] = useState<boolean>(false);
  const [collection, setCollection] = useState<WritersBlockCollection[]>(
    writersBlockSuggestions,
  );
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(collection, null, 2),
  );

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(event.target.value);
    try {
      const parsed = JSON.parse(event.target.value);
      setCollection(parsed);
      onJsonChange(parsed);
      setHasJSONFormatError(false);
    } catch (error) {
      setHasJSONFormatError(true);
    }
  };

  return (
    <div className="w-full border rounded-lg flex flex-col h-[600px] bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Writer&apos;s Block Catalog</h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <Textarea
            value={jsonText}
            onChange={handleJsonChange}
            className="w-full h-full min-h-[400px] font-mono text-sm"
          />
          {hasJSONFormatError ? (
            <p className="underline text-red-400 text-xs mx-auto text-center pt-6">
              Please review the JSON above, it is in the wrong format
            </p>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
