import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

type ExamCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
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

async function getCategoryWithExams(slug: string) {
  const supabase = createSupabaseServerClient();

  const { data: category, error: categoryError } = await supabase
    .from("exam_categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (categoryError || !category) {
    return null;
  }

  const { data: exams, error: examsError } = await supabase
    .from("exams")
    .select("id, name, slug, description, syllabus, eligibility, exam_pattern")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (examsError) {
    console.error("Failed to fetch exams:", examsError.message);
  }

  return {
    category: category as ExamCategory,
    exams: (exams ?? []) as Exam[],
  };
}

export default async function ExamCategoryPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const result = await getCategoryWithExams(slug);

  if (!result) {
    notFound();
  }

  const { category, exams } = result;

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <Link
          href={`/${lang}/exams`}
          className="text-sm font-semibold text-blue-700"
        >
          ← Back to Exam Categories
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name} Exam Preparation
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {category.description ??
            "Free syllabus, previous year papers and mock tests for this exam category."}
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Available Exams</h2>

          {exams.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-5">
              <h3 className="font-semibold">No exams found</h3>
              <p className="mt-2 text-sm text-slate-600">
                Exam pages will be added soon for this category.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {exams.map((exam) => (
                <article
                  key={exam.id}
                  className="rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{exam.name}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {exam.description ?? "Exam preparation resources."}
                  </p>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href={`/${lang}/exams/${exam.slug}/syllabus`}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:border-blue-300"
                    >
                      View Syllabus
                    </Link>

                    <Link
                      href={`/${lang}/exams/${exam.slug}/papers`}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:border-blue-300"
                    >
                      Previous Year Papers
                    </Link>

                    <Link
                      href={`/${lang}/exams/${exam.slug}/mock-test`}
                      className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Start Mock Test
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}