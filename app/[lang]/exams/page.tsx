import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: Promise<{ lang: string }>;
};

type ExamCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

async function getExamCategories(): Promise<ExamCategory[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("exam_categories")
    .select("id, name, slug, description")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch exam categories:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function ExamsPage({ params }: PageProps) {
  const { lang } = await params;
  const examCategories = await getExamCategories();

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-blue-700">ExamSaathi</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Exam Categories
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Start with Judiciary and SSC preparation. UPSC, Banking, State PSCs,
          Teaching, Defence, NEET and JEE will be added phase-wise.
        </p>

        {examCategories.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-5">
            <h2 className="font-semibold">No exam categories found</h2>
            <p className="mt-2 text-sm text-slate-600">
              Please check your Supabase database connection and seed data.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {examCategories.map((exam) => (
              <Link
                key={exam.id}
                href={`/${lang}/exams/${exam.slug}`}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold">{exam.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {exam.description ?? "Exam preparation resources."}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}