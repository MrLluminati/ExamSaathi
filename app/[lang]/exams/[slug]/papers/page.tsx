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

type Pdf = {
  id: number;
  title: string;
  file_url: string;
  language: string;
  pdf_type: string;
  download_count: number;
  created_at: string;
};

async function getExamWithPdfs(slug: string) {
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

  const { data: pdfs, error: pdfsError } = await supabase
    .from("pdfs")
    .select("id, title, file_url, language, pdf_type, download_count, created_at")
    .eq("exam_id", exam.id)
    .eq("is_active", true)
    .eq("is_premium", false)
    .order("created_at", { ascending: false });

  if (pdfsError) {
    console.error("Failed to fetch PDFs:", pdfsError.message);
  }

  return {
    exam: exam as Exam,
    pdfs: (pdfs ?? []) as Pdf[],
  };
}

export default async function PapersPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const result = await getExamWithPdfs(slug);

  if (!result) {
    notFound();
  }

  const { exam, pdfs } = result;

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
          {exam.name} Previous Year Papers
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Download free previous year papers, answer keys, syllabus PDFs and
          study material for {exam.name}.
        </p>

        {pdfs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-5">
            <h2 className="font-semibold">No PDFs uploaded yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Previous year papers and answer keys for this exam will be added
              soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {pdfs.map((pdf) => (
              <article
                key={pdf.id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{pdf.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Type: {pdf.pdf_type} · Language: {pdf.language.toUpperCase()} ·
                      Downloads: {pdf.download_count}
                    </p>
                  </div>

                  <a
                    href={pdf.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Download PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
