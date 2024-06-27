import { Suspense } from "react";
import { ImpersonationBadgeContent } from "./ImpersonationBadgeContent";
import { ImpersonationBadgeLoading } from "./ImpersonationBadgeLoading";

type Props = {
  address: string;
};

export function ImpersonationBadge({ address }: Props) {
  return (
    <Suspense fallback={<ImpersonationBadgeLoading />}>
      <ImpersonationBadgeContent address={address} />
    </Suspense>
  );
}
