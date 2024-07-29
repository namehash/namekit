import { highlight } from "sugar-high";

type CodeSnippetProps = {
  codeSnippet: string;
};

export const CodeSnippet = (props: CodeSnippetProps) => {
  const nameGuardMethods = [
    "getSecurePrimaryName",
    "fakeEthNameCheck",
    "inspectName",
    "bulkInspectNames",
  ];

  const findMethods = () => {
    const spans = highlight(props.codeSnippet).split("><");
    const toReplace = /var\(--sh-identifier\)/gi;
    const methodColor = "#2596be";

    return spans
      .map((elem: string) => {
        for (const method of nameGuardMethods) {
          if (elem.includes(method)) {
            return elem.replace(toReplace, methodColor);
          }
        }
        return elem;
      })
      .join("><");
  };

  const code = findMethods();

  return (
    <div className="hidden sm:block bg-black rounded-xl pb-4 max-w-full h-fit bg-gradient-to-b from-figma-black to-black z-10">
      <div className="flex flex-col gap-2.5 px-2.5 py-3">
        <div className="flex justify-start gap-2">
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
        </div>
      </div>
      <hr className="border-code-gray" />
      <div className="py-4 px-5 max-w-full">
        <pre className="w-full overflow-x-auto pb-4">
          <code
            dangerouslySetInnerHTML={{ __html: code }}
            className="inline-block [overflow-wrap:break-word]"
          />
        </pre>
      </div>
    </div>
  );
};
