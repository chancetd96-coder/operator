import Link from "next/link";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

export default function PrimaryButton({
  children,
  className = "",
  href,
}: Props) {
  const classes =
    `inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {children}
    </button>
  );
}