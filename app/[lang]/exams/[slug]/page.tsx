import Link from "next/link";

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export default async function ExamDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const examName = slug.replaceAll("-", " ");

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-blue-700">ExamSaathi</p>

        <h1 className="mt-3 text-3xl font-bold capitalize tracking-tight sm:text-4xl">
          {examName} Exam Preparation
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Get syllabus, eligibility, exam pattern, previous year papers and mock
          tests for this exam.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href={`/${lang}/exams/${slug}/syllabus`}
            className="rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <h2 className="font-semibold">Syllabus</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Subject-wise syllabus and exam structure.
            </p>
          </Link>

          <Link
            href={`/${lang}/exams/${slug}/papers`}
            className="rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <h2 className="font-semibold">Previous Year Papers</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Download previous year papers and answer keys.
            </p>
          </Link>

          <Link
            href={`/${lang}/exams/${slug}/mock-test`}
            className="rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <h2 className="font-semibold">Mock Test</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Practice timed MCQ tests.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
