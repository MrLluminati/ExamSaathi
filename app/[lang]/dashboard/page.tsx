import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { createSupabaseAuthClient } from "@/lib/supabase-auth";

type PageProps = {
  params: Promise<{ lang: string }>;
};

type ProgressRow = {
  id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_questions: number;
  attempted_at: string;
};

export default async function DashboardPage({ params }: PageProps) {
  const { lang } = await params;
  const supabase = await createSupabaseAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
        <section className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Login required</h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Please login to view your dashboard, saved scores and bookmarks.
          </p>

          <Link
            href={`/${lang}/login`}
            className="mt-6 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email, name, language_preference, exam_interests")
    .eq("id", user.id)
    .single();

  const { data: progressRows } = await supabase
    .from("progress")
    .select(
      "id, score, total_questions, correct_answers, wrong_answers, skipped_questions, attempted_at"
    )
    .eq("user_id", user.id)
    .order("attempted_at", { ascending: false })
    .limit(10);

  const progress = (progressRows ?? []) as ProgressRow[];

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Student Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-slate-600">
              {profile?.email ?? user.email}
            </p>
          </div>

          <LogoutButton lang={lang} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-600">Mock Tests Attempted</p>
            <p className="mt-2 text-3xl font-bold">{progress.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-600">Language Preference</p>
            <p className="mt-2 text-3xl font-bold uppercase">
              {profile?.language_preference ?? lang}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-600">Bookmarks</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xl font-bold">Recent Test History</h2>

          {progress.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              No saved test attempts yet. Once score saving is connected, your
              mock test history will appear here.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {progress.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-4 text-sm"
                >
                  <p className="font-semibold">
                    Score: {item.score}/{item.total_questions}
                  </p>
                  <p className="mt-1 text-slate-600">
                    Correct: {item.correct_answers} · Wrong:{" "}
                    {item.wrong_answers} · Skipped: {item.skipped_questions}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {new Date(item.attempted_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
