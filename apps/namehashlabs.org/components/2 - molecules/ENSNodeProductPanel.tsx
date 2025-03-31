import { BoltIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@namehash/namekit-react";
import Image from "next/image";

export const ENSNodeProductPanel = () => {
  return (
    <div className="lg:px-[120px] px-5 w-full flex items-center justify-center">
      <div className="w-full flex flex-col lg:flex-row items-center lg:gap-10 max-w-[1216px] bg-dark-blue rounded-[20px] p-8 lg:p-20 bg-[#0d111c]">
        {/* Mobile badge - At the top */}
        <div className="flex justify-center lg:hidden w-full mb-8 order-1">
          <div className="items-center gap-2 px-4 py-2 bg-gray-800 rounded-[20px] inline-flex">
            <BoltIcon className="w-4 h-4 text-gray-300" />
            <span className="text-sm leading-5 font-medium text-gray-300">
              Critical ENSv2 Infrastructure
            </span>
          </div>
        </div>

        {/* Image section - Second on mobile, Left on desktop */}
        <div className="lg:w-1/2 w-full lg:mt-0 order-2">
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full">
              <Image
                quality={100}
                src="/images/ensnode-diagram.png"
                alt="ENSNode infrastructure diagram showing multiple chains connecting"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content section - Last on mobile, Right on desktop */}
        <div className="lg:w-1/2 w-full flex items-start justify-center order-3">
          <div className="flex-col inline-flex gap-5 lg:max-w-[568px]">
            {/* Badge lg screen */}
            <div className="justify-center lg:justify-start hidden lg:flex">
              <div className="items-center gap-2 px-4 py-2 bg-gray-800 rounded-[20px] inline-flex">
                <BoltIcon className="w-4 h-4 text-gray-300" />
                <span className="text-sm leading-5 font-medium text-gray-300">
                  Critical ENSv2 Infrastructure
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <h2 className="text-2xl leading-8 lg:text-4xl lg:leading-10 font-bold lg:text-start text-center text-white">
                ENSNode
              </h2>
            </div>

            <div className="space-y-4 text-gray-300 lg:text-start text-center">
              <p>
                Many ENS apps with widespread adoption depend on the ENS
                Subgraph as critical infrastructure for ENSv1, generating over
                700 million / requests a year. However, the Subgraph is single
                chain only. This means ENS apps already lack data on more than
                90% of ENS names. The Subgraph is fundamentally incompatible
                with ENSv2.
              </p>
              <p>
                The launch and operation of ENSv2 has a critical need for a
                strong &quot;production ready&quot; ENS data indexing solution.
                That solution is ENSNode, the new multichain indexer for ENSv2
                that will also radically accelerate slow ENS resolution times,
                boost ENS DAO revenues, fill missing infrastructure for ENS
                tokenization data, and support the success of Namechain.
              </p>
            </div>

            <div className="flex lg:justify-start justify-center">
              <Button variant="secondary" asChild>
                <Link target="_blank" href="https://ensnode.io/">
                  Learn more
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
