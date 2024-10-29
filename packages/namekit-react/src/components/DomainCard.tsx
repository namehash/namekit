import * as React from "react";

export type DomainCardProps = {
  name: string;
};

export function DomainCard({ name }: DomainCardProps) {
  return (
    <div>
      Domain card for <span className="ens-webfont">{name}</span>
    </div>
  );
}
