interface SectionTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const SectionTitle = ({
  className,
  children,
  ...props
}: SectionTitleProps) => {
  return (
    <div
      role="heading"
      aria-level={3}
      className={`lg:text-4xl text-3xl lg:leading-10 leading-9 font-bold text-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
