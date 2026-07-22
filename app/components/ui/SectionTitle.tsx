type SectionTitleProps = {
  children: string;
  className?: string;
};

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <p
      className={`text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 ${className}`}
    >
      {children}
    </p>
  );
}
