export default function Loading() {
  return (
    <div className="flex w-full flex-col h-screen overflow-hidden">
      <div className="flex">
        <div className="border-b border-gray-200 flex items-center px-2 md:px-4 py-3 border-l-0 z-10 max-md:h-fit md:max-h-sm w-full h-16">
          <div className="flex w-full items-center">
            <div className="mr-2 font-bold text-sm">To:</div>
            <div className="min-w-[40px] max-w-[40px] h-[40px] rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse"></div>
            <div className="ml-2 md:ml-4 space-y-1">
              <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-52"></div>
              <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-72"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full overflow-auto flex flex-col">
        <div className="p-6 space-y-1.5">
          <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-12"></div>
          <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-52"></div>
          <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-32"></div>
        </div>
      </div>
      <div className="flex flex-col border border-gray-300 rounded-2xl m-4">
        <div className="h-14 p-4 text-sm text-gray-500">
          <div className="rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-52"></div>
        </div>
        <div className="h-10 bg-gray-100 rounded-b-2xl"></div>
      </div>
    </div>
  );
}
