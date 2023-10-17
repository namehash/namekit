import React from "react";
import { Summary, Status } from ".";
import { type NameGuardReport } from "@namehash/nameguard";

const Report = ({ data }: { data: NameGuardReport }) => {
  const { name, highest_risk, rating, risk_count, checks, labels } = data;

  const rawLabels = labels.map((label) => label.label);

  return (
    <>
      <div className="space-y-2 md:w-1/2 md:pr-4">
        <h2 className="text-black text-2xl font-semibold">NameGuard Report</h2>
        <p className="text-gray-500 text-sm leading-6 font-normal">
          NameGuard protects you from being tricked by names that look
          confusingly similar and helps to identify any risks or limitations a
          name might have.
        </p>
      </div>

      <Summary name={name} rating={rating} highest_risk={highest_risk} />

      <div className="space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          {risk_count} of {checks.length} risks found
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {checks.map(({ check, status, message }) => (
            <div
              key={check}
              className="p-5 flex items-center space-x-4 border border-gray-200 rounded-md bg-gradient-to-r from-gray-200/0 to-gray-50"
            >
              <div className="flex-shrink-0 rounded-full w-12 h-12 border border-gray-200 bg-white flex items-center justify-center">
                <Status status={status} />
              </div>
              <div className="">
                <p className="text-black font-semibold text-sm leading-6">
                  {check}
                </p>
                <p className="text-gray-500 text-sm leading-6 font-normal">
                  {message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          Name inspection
        </p>

        {labels.map((label) => (
          <div
            key={label.label}
            className="border border-gray-200 rounded-md divide-y divide-gray-200"
          >
            <div className="py-[10px] px-6 text-sm font-normal">
              {rawLabels.map((l, index) => (
                <>
                  <span
                    key={index}
                    className={
                      l === label.label ? "text-black" : "text-gray-500"
                    }
                  >
                    {l}
                  </span>
                  {index < rawLabels.length - 1 && (
                    <span className="text-gray-500">.</span>
                  )}
                </>
              ))}
            </div>
            {label?.graphemes?.map((grapheme) => (
              <div
                key={grapheme.grapheme}
                className="grid grid-cols-8 gap-4 py-5"
              >
                <div className="flex items-center justify-center">
                  <p className="text-4xl text-black font-bold">
                    {grapheme.grapheme}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-black text-sm font-medium">
                    {grapheme.grapheme_name}
                  </p>
                  <p className="text-gray-500 text-sm font-normal">
                    {grapheme.grapheme_script}
                  </p>
                </div>
                <div className="col-span-4 flex space-between space-x-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Status status={grapheme.rating} />
                    </div>
                    <p className="font-medium text-black text-sm">
                      {grapheme.highest_risk?.message}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center justify-end pr-10">
                    <svg
                      width="10"
                      height="18"
                      viewBox="0 0 10 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.25 1.5L8.75 9L1.25 16.5"
                        stroke="#AFAFAF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div> */}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="rounded-md overflow-hidden border border-gray-200 relative bg-gradient-to-r from-[#FBD84D]/5 via-[#F965D9]/5 to-[#503BFE]/5 bg-opacity-5 p-6 md:p-10">
        <div className="z-0 absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-between items-center">
          <div>
            <p className="text-black font-semibold text-lg leading-8">
              Have feedback or suggestions?
            </p>
            <p className="text-gray-500 font-normal leading-6 text-sm">
              If you think any inspection result could be improved please
              contact us. The NameHash team is happy to help.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <a
              href="#"
              className="rounded-md block md:inline-block text-center bg-black text-white px-5 py-3 font-medium leading-6"
            >
              Chat with us
            </a>
          </div>
        </div>
      </div>

      <div className="text-center px-6">
        <p className="text-sm leading-6 text-gray-500">
          Report generated by NameGuard (Beta)
        </p>
      </div>
    </>
  );
};

export default Report;
