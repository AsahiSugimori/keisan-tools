import Link from "next/link";

type BackLinkProps = {
  href?: string;
  label?: string;
};

export default function BackLink({
  href = "/",
  label = "ツール一覧へ戻る",
}: BackLinkProps) {
  return (
    <div className="mb-4">
      <Link
        href={href}
        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
      >
        <span className="mr-1">←</span>
        {label}
      </Link>
    </div>
  );
}