import React, { MouseEventHandler } from "react";

type FeedbackNoticeProps = {
  onChatClick?: MouseEventHandler<HTMLButtonElement>;
};

export const FeedbackNotice = ({ onChatClick }: FeedbackNoticeProps) => {
  return (
    <div className="ng-rounded-md ng-overflow-hidden ng-border ng-border-gray-200 ng-relative ng-bg-gradient-to-r ng-from-[#FBD84D]/5 via-[#F965D9]/5 to-[#503BFE]/5 ng-bg-opacity-5 ng-p-6 md:ng-p-10">
      <div className="ng-z-0 ng-absolute ng-inset-0 ng-h-full ng-w-full ng-bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="ng-relative ng-z-10 ng-flex ng-flex-col md:ng-flex-row ng-space-y-4 md:ng-space-y-0 md:ng-space-x-6 ng-justify-between ng-items-center">
        <div>
          <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-8">
            Have feedback or suggestions?
          </p>
          <p className="ng-text-gray-500 ng-font-normal ng-leading-6 ng-text-sm">
            If you think any inspection result could be improved please contact
            us. The NameHash Labs team is happy to help.
          </p>
        </div>

        {onChatClick && (
          <div className="ng-w-full md:ng-w-auto ng-flex-shrink-0">
            <button
              onClick={onChatClick}
              className="ng-rounded-md ng-block md:ng-inline-block ng-text-center ng-bg-black ng-text-white ng-px-5 ng-py-3 ng-font-medium ng-leading-6 ng-transition hover:ng-bg-gray-900"
            >
              Chat with us
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
