import Link from "next/link";
import AuthForm from "@/components/AuthForm";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <Link href={`/${lang}`} className="text-sm font-semibold text-blue-700">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Login to ExamSaathi
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Login to save mock test scores, track progress, bookmark PDFs and
          personalise your exam preparation.
        </p>

        <AuthForm lang={lang} />
      </section>
    </main>
  );
}
