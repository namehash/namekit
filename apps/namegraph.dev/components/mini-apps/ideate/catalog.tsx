"use client";

import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";
import { Tooltip } from "@namehash/namekit-react/client";
import { InfoIcon } from "lucide-react";
import { WritersBlockCollection } from "@namehash/namegraph-sdk/utils";

interface CatalogProps {
  onJsonChange: (parsedJson: any) => void;
}

export function Catalog({ onJsonChange }: CatalogProps) {
  const catalogTextarea = useRef<null | HTMLTextAreaElement>(null);
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
      <div className="p-4 border-b flex justify-start items-center space-x-3">
        <h2 className="text-xl font-semibold">Writer&apos;s Block Catalog</h2>
        <Tooltip
          trigger={
            <InfoIcon
              className="w-4 cursor-pointer"
              role="button"
              onClick={() => {
                catalogTextarea.current?.focus();
              }}
            />
          }
        >
          <div className="bg-white p-2 rounded-md border-2 text-sm">
            📖 By modifying the below text you <br />
            can customize the catalog of name
            <br /> collections you want to ideate around 🌏
          </div>
        </Tooltip>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <Textarea
            value={jsonText}
            ref={catalogTextarea}
            onChange={handleJsonChange}
            className="w-full h-full min-h-[400px] font-mono text-sm"
          />
          {hasJSONFormatError ? (
            <p className="underline text-red-400 text-xs mx-auto text-center pt-6">
              Please review the JSON above as it is in the wrong format
            </p>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
