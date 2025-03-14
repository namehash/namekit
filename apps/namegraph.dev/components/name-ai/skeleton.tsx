import { NameAILogo } from "./nameai-logo";

export function TokenAnalysisResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="px-3 py-1.5 border border-gray-200 rounded">
          <div className="flex justify-start space-x-2 items-center mb-3 mt-1.5">
            <NameAILogo className="w-6 h-6" />
            <h3 className="text-lg font-semibold">NameAI Tokenization</h3>
          </div>
          <div className="bg-white flex items-center mb-3 h-12">
            <div className="animate-pulse flex space-between items-center w-full">
              <div className="flex space-x-2">
                <div className="bg-gray-100 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-10"></div>
                <div className="bg-gray-100 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-16"></div>
                <div className="bg-gray-100 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
              </div>
              <div className="w-24 ml-auto h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
