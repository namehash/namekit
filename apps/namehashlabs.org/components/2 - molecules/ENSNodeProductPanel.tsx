import { BoltIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@namehash/namekit-react";
import Image from "next/image";

export const ENSNodeProductPanel = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-5">
      <div className="flex flex-col lg:flex-row gap-8 p-20 pl-8 bg-dark-blue rounded-2xl w-full max-w-[1216px] bg-[#0d111c] mt-20">
        {/* Left side - Image */}
        <div className="flex-1">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/ensnode-diagram.png" // You'll need to add this image to your public folder
              alt="ENSNode infrastructure diagram showing multiple chains connecting"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-sm">
            <BoltIcon className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300">Critical ENSv2 Infrastructure</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white">ENSNode</h2>

          {/* Description */}
          <div className="space-y-4 text-gray-300">
            <p>
              Many ENS apps with widespread adoption depend on the ENS Subgraph
              as critical infrastructure for ENSv1, generating over 700 million
              / requests a year. However, the Subgraph is single chain only.
              This means ENS apps already lack data on more than 90% of ENS
              names. The Subgraph is fundamentally incompatible with ENSv2.
            </p>
            <p>
              The launch and operation of ENSv2 has a critical need for a strong
              &quot;production ready&quot; ENS data indexing solution. That
              solution is ENSNode, the new multichain indexer for ENSv2 that
              will also radically accelerate slow ENS resolution times, boost
              ENS DAO revenues, fill missing infrastructure for ENS tokenization
              data, and support the success of Namechain.
            </p>
          </div>

          {/* CTA Button */}
          <Button variant="secondary" asChild>
            <Link target="_blank" href="https://ensnode.io/">
              Learn more
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
