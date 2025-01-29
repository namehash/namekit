interface SkeletonProps {
  label?: string;
}

export function Skeleton({ label }: SkeletonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Label For Analysis</h3>

        <p className="bg-white flex items-center px-3 py-1.5 border border-gray-300 rounded mb-3 shadow-sm ens-webfont h-12">
          {label}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recommended Tokenization</h3>
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

      <div>
        <h3 className="text-lg font-semibold mb-2">Discovered Tokenizations</h3>
        <div className="bg-white flex items-center px-3 py-1.5 border border-gray-300 rounded mb-3 shadow-sm h-12">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-2">
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-16"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-12"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
            </div>
            <div className="w-24 ml-auto h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white flex items-center px-3 py-1.5 border border-gray-300 rounded mb-3 shadow-sm h-12">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-2">
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-10"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-16"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-20"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
            </div>
            <div className="w-24 ml-auto h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white flex items-center px-3 py-1.5 border border-gray-300 rounded mb-3 shadow-sm h-12">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-2">
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-8"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-20"></div>
              <div className="bg-gray-200 rounded px-3 py-1 text-sm border font-semibold h-[28px] w-16"></div>
            </div>
            <div className="w-24 ml-auto h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
