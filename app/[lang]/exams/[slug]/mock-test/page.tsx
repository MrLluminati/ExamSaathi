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
};

type MockTest = {
  id: number;
  title: string;
  slug: string | null;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  language: string;
};

async function getExamWithMockTests(slug: string) {
  const supabase = createSupabaseServerClient();

  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (examError || !exam) {
    return null;
  }

  const { data: mockTests, error: mockTestsError } = await supabase
    .from("mock_tests")
    .select("id, title, slug, description, duration_minutes, total_questions, language")
    .eq("exam_id", exam.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (mockTestsError) {
    console.error("Failed to fetch mock tests:", mockTestsError.message);
  }

  return {
    exam: exam as Exam,
    mockTests: (mockTests ?? []) as MockTest[],
  };
}

export default async function MockTestPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const result = await getExamWithMockTests(slug);

  if (!result) {
    notFound();
  }

  const { exam, mockTests } = result;

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
          {exam.name} Mock Tests
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Practice timed MCQ tests for {exam.name}. Score tracking will be added
          with Supabase Auth.
        </p>

        {mockTests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-5">
            <h2 className="font-semibold">No mock tests available yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Timed mock tests for this exam will be added soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {mockTests.map((test) => (
              <article
                key={test.id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{test.title}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {test.description ?? "Timed practice test for exam preparation."}
                </p>

                <div className="mt-4 text-sm text-slate-600">
                  <p>Duration: {test.duration_minutes} minutes</p>
                  <p>Total Questions: {test.total_questions}</p>
                  <p>Language: {test.language.toUpperCase()}</p>
                </div>

                <Link
                   href={`/${lang}/exams/${slug}/mock-test/${test.slug}`}
                   className="mt-4 block w-full rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Start Test
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
