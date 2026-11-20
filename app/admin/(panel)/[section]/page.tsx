import { notFound } from "next/navigation";
import SectionEditor from "@/components/admin/SectionEditor";
import { getSectionValue, listRevisions } from "@/lib/content";
import { SECTION_MAP, isSectionKey } from "@/lib/content-schema";
import { hasDb } from "@/lib/mongo";

export function generateMetadata({ params }: { params: { section: string } }) {
  return { title: isSectionKey(params.section) ? SECTION_MAP[params.section].title : "Not found" };
}

export default async function SectionPage({ params }: { params: { section: string } }) {
  if (!isSectionKey(params.section)) notFound();
  const key = params.section;
  let data, revisions;
  try {
    [data, revisions] = await Promise.all([getSectionValue(key), listRevisions(key)]);
  } catch {
    return (
      <p className="max-w-xl rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
        Could not read from MongoDB. Check <code>MONGODB_URI</code> and your Atlas network access, then reload.
      </p>
    );
  }
  return <SectionEditor sectionKey={key} initial={data.value} customized={data.customized} dbReady={hasDb()} revisions={revisions} />;
}
