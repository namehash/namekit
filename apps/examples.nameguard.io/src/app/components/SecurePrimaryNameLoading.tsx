interface Props {
  address: string;
}

export function SecurePrimaryNameLoading({ address }: Props) {
  return (
    <div className="flex flex-col items-start flex-1 overflow-hidden">
      <div className="rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-16" />

      <div className="self-stretch truncate">
        {address}
      </div>

      <div className="rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse h-4 w-32" />
    </div>
  );
}
