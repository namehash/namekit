import { Button } from "@namehash/namekit-react";
import React, { MouseEventHandler } from "react";

type FeedbackNoticeProps = {
  onChatClick?: MouseEventHandler<HTMLButtonElement>;
};

export const FeedbackNotice = ({ onChatClick }: FeedbackNoticeProps) => {
  return (
    <div className="rounded-md overflow-hidden border border-gray-200 relative bg-gradient-to-r from-[#FBD84D]/5 via-[#F965D9]/5 to-[#503BFE]/5 bg-opacity-5 p-6 md:p-10">
      <div className="z-0 absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative z-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-between items-center">
        <div>
          <p className="text-black font-semibold text-lg leading-8">
            Have feedback or suggestions?
          </p>
          <p className="text-gray-500 font-normal leading-6 text-sm">
            If you think any inspection result could be improved please contact
            us. The NameHash Labs team is happy to help.
          </p>
        </div>

        {onChatClick && <Button onClick={onChatClick}>Chat with us</Button>}
      </div>
    </div>
  );
};
