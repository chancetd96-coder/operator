import Link from "next/link";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export default function PrimaryButton({
  children,
  className = "",
  href,
  onClick,
  disabled = false,
  type = "button",
}: Props) {
  const classes = [
    "inline-flex items-center justify-center rounded-lg",
    "bg-white px-5 py-3 font-semibold text-zinc-950",
    "transition hover:bg-zinc-200",
    "disabled:cursor-not-allowed disabled:opacity-40",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
