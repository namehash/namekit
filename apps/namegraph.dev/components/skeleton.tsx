interface SkeletonProps {
  className?: string;
  roundedClass?: string;
}

export const Skeleton = ({
  className = "w-16 h-2",
  roundedClass = "rounded-md",
}: SkeletonProps) => {
  return (
    <div
      className={`${className} flex items-center self-center text-gray-200 animate-pulse`}
    >
      <div className={`${roundedClass} bg-gray-100 w-full h-full`}></div>
    </div>
  );
};

export default Skeleton;
