interface SkeletonProps {
  label?: string;
}

export function Skeleton({ label }: SkeletonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Label For Analysis</h3>

        <p className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm ens-webfont">
          {label}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Top Tokenization</h3>
        <div className="bg-white flex items-center p-3 h-12 border border-gray-300 rounded mb-3 shadow-sm">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-1.5">
              <div className="h-5 bg-gray-200 rounded w-10"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-6"></div>
            </div>
            <div className="w-32 ml-auto h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Alternative Tokenizations
        </h3>
        <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-1.5">
              <div className="h-5 bg-gray-200 rounded w-10"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-6"></div>
            </div>
            <div className="w-32 ml-auto h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-1.5">
              <div className="h-5 bg-gray-200 rounded w-10"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-6"></div>
            </div>
            <div className="w-32 ml-auto h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm">
          <div className="animate-pulse flex space-between items-center w-full">
            <div className="flex space-x-1.5">
              <div className="h-5 bg-gray-200 rounded w-10"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-6"></div>
            </div>
            <div className="w-32 ml-auto h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
