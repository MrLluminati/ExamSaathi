import Link from "next/link";

const examCategories = [
  {
    name: "Judiciary",
    slug: "judiciary",
    description: "Civil Judge, District Judge and High Court exam preparation.",
  },
  {
    name: "SSC",
    slug: "ssc",
    description: "SSC CGL, CHSL, MTS and other Staff Selection Commission exams.",
  },
];

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ExamsPage({ params }: PageProps) {
  const { lang } = await params;

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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {examCategories.map((exam) => (
            <Link
              key={exam.slug}
              href={`/${lang}/exams/${exam.slug}`}
              className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{exam.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {exam.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
