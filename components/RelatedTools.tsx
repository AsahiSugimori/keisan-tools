import Link from "next/link";

type RelatedTool = {
  href: string;
  title: string;
  description: string;
};

type RelatedToolsProps = {
  tools: RelatedTool[];
};

export default function RelatedTools({ tools }: RelatedToolsProps) {
  return (
    <section className="mx-auto mt-8 max-w-3xl px-4 pb-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">関連ツール</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
            >
              <div className="font-bold">{tool.title}</div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}