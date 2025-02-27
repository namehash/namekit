interface SectionTextProps {
  children?: React.ReactNode;
  className?: string;
}

export const SectionText = ({
  className,
  children,
  ...props
}: SectionTextProps) => {
  return (
    <div
      className={`text-gray-500 text-lg leading-7 font-light  ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
