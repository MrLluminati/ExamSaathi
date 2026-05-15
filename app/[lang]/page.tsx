import Link from "next/link";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-blue-700">ExamSaathi</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Free multilingual exam preparation for Indian students
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Prepare for Judiciary, SSC, UPSC, Banking, Defence, Teaching, NEET,
          JEE and State PSC exams with free study material, previous year papers
          and mock tests.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${lang}/exams`}
            className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Explore Exams
          </Link>

          <Link
            href={`/${lang}/current-affairs`}
            className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold"
          >
            Daily Current Affairs
          </Link>
        </div>
      </section>
    </main>
  );
}