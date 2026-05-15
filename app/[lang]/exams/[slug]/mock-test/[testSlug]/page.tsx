import Link from "next/link";
import { notFound } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { createSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
    testSlug: string;
  }>;
};

type Question = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string | null;
  subject: string | null;
  difficulty: string | null;
};

type RawQuestion = Omit<Question, "correct_answer"> & {
  correct_answer: string;
};

type MockTestQuestionRow = {
  question_order: number;
  questions: RawQuestion | RawQuestion[] | null;
};

async function getMockTest(testSlug: string) {
  const supabase = createSupabaseServerClient();

  const { data: mockTest, error: mockTestError } = await supabase
    .from("mock_tests")
    .select("id, title, slug, duration_minutes")
    .eq("slug", testSlug)
    .eq("is_active", true)
    .single();

  if (mockTestError || !mockTest) {
    return null;
  }

  const { data: rows, error: questionsError } = await supabase
    .from("mock_test_questions")
    .select(
      `
      question_order,
      questions (
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        subject,
        difficulty
      )
    `
    )
    .eq("mock_test_id", mockTest.id)
    .order("question_order", { ascending: true });

  if (questionsError) {
    console.error("Failed to fetch mock test questions:", questionsError.message);
  }

  const questions = ((rows ?? []) as unknown as MockTestQuestionRow[])
    .map((row) => {
      if (Array.isArray(row.questions)) {
        return row.questions[0] ?? null;
      }

      return row.questions;
    })
    .filter((question): question is RawQuestion => Boolean(question))
    .map((question) => ({
      ...question,
      correct_answer: question.correct_answer as Question["correct_answer"],
    }));

  return {
    title: mockTest.title as string,
    durationMinutes: mockTest.duration_minutes as number,
    questions,
  };
}

export default async function MockTestAttemptPage({ params }: PageProps) {
  const { lang, slug, testSlug } = await params;
  const mockTest = await getMockTest(testSlug);

  if (!mockTest) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <Link
          href={`/${lang}/exams/${slug}/mock-test`}
          className="text-sm font-semibold text-blue-700"
        >
          ← Back to Mock Tests
        </Link>

        <div className="mt-6">
          <QuizEngine
            title={mockTest.title}
            durationMinutes={mockTest.durationMinutes}
            questions={mockTest.questions}
          />
        </div>
      </section>
    </main>
  );
}