import { nameguard } from "@namehash/nameguard";
import { ImpersonationReport } from "@/app/components/ImpersonationReport";
import { Avatar } from "@/app/components/Avatar";

export default async function Page({
  params,
}: {
  params: { address: string };
}) {
  const { address } = params;

  const data = await nameguard.getSecurePrimaryName(address, {
    returnNameGuardReport: true,
  });

  return (
    <div className="flex w-full flex-col h-screen overflow-hidden">
      <div className="flex">
        <div className="border-b border-gray-200 flex items-center px-2 md:px-4 py-3 border-l-0 z-10 max-md:h-fit md:max-h-sm w-full h-16">
          <div className="flex w-full items-center">
            <div className="mr-2 font-bold text-sm">To:</div>
            <Avatar address={address} name={data.primary_name} />
            <div className="ml-2 md:ml-4">
              <div className="font-bold text-md flex items-center space-x-1.5">
                <span>{data.display_name}</span>
                <ImpersonationReport data={data} />
              </div>
              <div className="font-mono text-sm max-md:text-xs h-5 text-gray-500">
                {address}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full overflow-auto flex flex-col">
        <div className="p-6 space-y-1.5">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
      <div className="flex flex-col border border-gray-300 rounded-2xl m-4">
        <div className="h-14 p-4 text-sm text-gray-500">Write a message</div>
        <div className="h-10 bg-gray-100 rounded-b-2xl"></div>
      </div>
    </div>
  );
}
