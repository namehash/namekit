export function TokenAnalysisResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">NameAI Tokenization</h3>
        </div>
        <div className="bg-white flex items-center px-3 py-1.5 border border-gray-300 rounded mb-3 shadow-sm h-12">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-2">
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-10"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-16"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
            </div>
            <div className="w-24 ml-auto h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

