import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

type Exam = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  syllabus: string | null;
  eligibility: string | null;
  exam_pattern: string | null;
};

async function getExam(slug: string): Promise<Exam | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("exams")
    .select("id, name, slug, description, syllabus, eligibility, exam_pattern")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Exam;
}

export default async function SyllabusPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const exam = await getExam(slug);

  if (!exam) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <Link
          href={`/${lang}/exams`}
          className="text-sm font-semibold text-blue-700"
        >
          ← Back to Exams
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {exam.name} Syllabus
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {exam.description ?? "Complete syllabus and exam preparation details."}
        </p>

        <div className="mt-8 grid gap-4">
          <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Syllabus</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {exam.syllabus ?? "Detailed syllabus will be updated soon."}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Eligibility</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {exam.eligibility ?? "Eligibility details will be updated soon."}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Exam Pattern</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {exam.exam_pattern ?? "Exam pattern will be updated soon."}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
