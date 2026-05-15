"use client";

import { useMemo, useState } from "react";

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

type QuizEngineProps = {
  title: string;
  durationMinutes: number;
  questions: Question[];
};

type AnswerMap = Record<number, "A" | "B" | "C" | "D">;

export default function QuizEngine({
  title,
  durationMinutes,
  questions,
}: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return answers[question.id] === question.correct_answer
        ? total + 1
        : total;
    }, 0);
  }, [answers, questions]);

  const attemptedCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  function selectAnswer(questionId: number, option: "A" | "B" | "C" | "D") {
    if (isSubmitted) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: option,
    }));
  }

  function goToPrevious() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function goToNext() {
    setCurrentIndex((index) => Math.min(index + 1, totalQuestions - 1));
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-5">
        <h2 className="font-semibold">No questions available</h2>
        <p className="mt-2 text-sm text-slate-600">
          Questions for this mock test will be added soon.
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">Result</p>
          <h1 className="mt-2 text-3xl font-bold">{title}</h1>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Score</p>
              <p className="mt-1 text-2xl font-bold">
                {score}/{totalQuestions}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Attempted</p>
              <p className="mt-1 text-2xl font-bold">{attemptedCount}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Accuracy</p>
              <p className="mt-1 text-2xl font-bold">
                {attemptedCount === 0
                  ? "0%"
                  : `${Math.round((score / attemptedCount) * 100)}%`}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correct_answer;

            return (
              <article
                key={question.id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-500">
                  Question {index + 1}
                </p>

                <h2 className="mt-2 font-semibold leading-7">
                  {question.question}
                </h2>

                <div className="mt-4 space-y-2 text-sm">
                  <p>A. {question.option_a}</p>
                  <p>B. {question.option_b}</p>
                  <p>C. {question.option_c}</p>
                  <p>D. {question.option_d}</p>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                  <p>
                    Your Answer:{" "}
                    <span className={isCorrect ? "font-bold text-green-700" : "font-bold text-red-700"}>
                      {selectedAnswer ?? "Not Attempted"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Correct Answer:{" "}
                    <span className="font-bold text-green-700">
                      {question.correct_answer}
                    </span>
                  </p>

                  {question.explanation ? (
                    <p className="mt-3 leading-6 text-slate-700">
                      {question.explanation}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Mock Test</p>
            <h1 className="mt-2 text-2xl font-bold">{title}</h1>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Duration: {durationMinutes} minutes
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-700"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Question {currentIndex + 1} of {totalQuestions} · Attempted{" "}
          {attemptedCount}/{totalQuestions}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-500">
            {currentQuestion.subject ?? "General"} ·{" "}
            {currentQuestion.difficulty ?? "medium"}
          </p>
        </div>

        <h2 className="mt-4 text-xl font-semibold leading-8">
          {currentQuestion.question}
        </h2>

        <div className="mt-6 grid gap-3">
          {[
            ["A", currentQuestion.option_a],
            ["B", currentQuestion.option_b],
            ["C", currentQuestion.option_c],
            ["D", currentQuestion.option_d],
          ].map(([option, text]) => {
            const isSelected = answers[currentQuestion.id] === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  selectAnswer(
                    currentQuestion.id,
                    option as "A" | "B" | "C" | "D"
                  )
                }
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  isSelected
                    ? "border-blue-700 bg-blue-50 text-blue-900"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <span className="font-bold">{option}.</span> {text}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setIsSubmitted(true)}
              className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white"
            >
              Submit Test
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNext}
              className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white"
            >
              Next
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
