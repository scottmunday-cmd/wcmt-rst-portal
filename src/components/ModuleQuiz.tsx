"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { QuestionPublic } from "@/types/database";

type AnswerKey = "a" | "b" | "c" | "d";

// Practice quiz for a single module, backed by questions_public (never the
// underlying `questions` table, which keeps correct_answer hidden — see
// 0002_rls_policies.sql / 0008_content_paywall.sql) and the grade_quiz_answer
// RPC, which is the only thing allowed to know which option is correct.
//
// This is the learning tool, so a wrong pick doesn't end the question — it's
// marked wrong and the student can try again until they land on the right
// answer, which is what actually locks in the concept before moving on.
// Score only credits an answer gotten right on the FIRST try, so the running
// score still means something. (The full-length MockExamQuiz stays one
// attempt per question on purpose, to mirror the real assessment.)
export function ModuleQuiz({ moduleId }: { moduleId: number }) {
  const [questions, setQuestions] = useState<QuestionPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [attempted, setAttempted] = useState<Set<AnswerKey>>(new Set());
  const [selected, setSelected] = useState<AnswerKey | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("questions_public")
        .select("*")
        .eq("module_id", moduleId)
        .order("id");
      if (cancelled) return;
      if (error) {
        setError("Couldn't load practice questions for this module yet.");
      } else {
        setQuestions(data ?? []);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  async function choose(letter: AnswerKey) {
    if (!questions || checking || correct === true || attempted.has(letter)) return;
    const isFirstAttempt = attempted.size === 0;
    setChecking(true);
    const supabase = createClient();
    const q = questions[index];
    const { data, error } = await supabase.rpc("grade_quiz_answer", {
      p_question_id: q.id,
      p_selected: letter,
    });
    setChecking(false);
    if (error) {
      setError("Couldn't check that answer — please try again.");
      return;
    }
    const isCorrect = Boolean(data);
    setSelected(letter);
    setCorrect(isCorrect);
    if (isCorrect) {
      if (isFirstAttempt) setScore((s) => s + 1);
    } else {
      setAttempted((prev) => new Set(prev).add(letter));
    }
  }

  function next() {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      setFinished(true);
      void saveProgress();
      return;
    }
    setIndex((i) => i + 1);
    setAttempted(new Set());
    setSelected(null);
    setCorrect(null);
  }

  function restart() {
    setIndex(0);
    setAttempted(new Set());
    setSelected(null);
    setCorrect(null);
    setScore(0);
    setFinished(false);
  }

  async function saveProgress() {
    if (!questions || questions.length === 0) return;
    try {
      const supabase = createClient();
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .maybeSingle<{ id: string }>();
      if (!student) return;
      const pct = Math.round((score / questions.length) * 100);
      await supabase.from("student_progress").upsert(
        {
          student_id: student.id,
          module_id: moduleId,
          quiz_score: pct,
          percentage_complete: pct,
          completed: pct >= 80,
        },
        { onConflict: "student_id,module_id" }
      );
    } catch {
      // Best-effort only — the score still displays even if this fails
      // (e.g. a logged-in admin/instructor with no students row).
    }
  }

  if (error) {
    return <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{error}</Card>;
  }

  if (!questions) {
    return <p className="text-sm text-slate-500">Loading practice questions…</p>;
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-slate-500">No practice questions for this module yet.</p>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <h3 className="font-heading text-lg font-semibold text-wcmt-navy">Quiz complete</h3>
        <p className="mt-1 text-sm text-slate-600">
          You scored {score} out of {questions.length} ({pct}%) on your first try at each question.
        </p>
        <Button variant="outline" className="mt-4" onClick={restart}>
          Try again
        </Button>
      </Card>
    );
  }

  const q = questions[index];
  const options: { key: AnswerKey; text: string }[] = [
    { key: "a", text: q.answer_a },
    { key: "b", text: q.answer_b },
    { key: "c", text: q.answer_c },
    { key: "d", text: q.answer_d },
  ];
  const solved = correct === true;

  return (
    <Card>
      <p className="text-xs font-semibold uppercase text-wcmt-coastal">
        Question {index + 1} of {questions.length}
      </p>
      <h3 className="mt-1 font-heading font-semibold text-wcmt-navy">{q.question_text}</h3>
      <div className="mt-4 space-y-2">
        {options.map((opt) => {
          const wasWrong = attempted.has(opt.key);
          const isRevealedCorrect = solved && selected === opt.key;
          const disabled = wasWrong || solved || checking;
          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled}
              onClick={() => choose(opt.key)}
              className={clsx(
                "block w-full rounded-md border px-4 py-2 text-left text-sm transition-colors",
                !wasWrong && !isRevealedCorrect && "border-slate-200 hover:border-wcmt-coastal",
                isRevealedCorrect && "border-wcmt-green bg-green-50 text-wcmt-green",
                wasWrong && "border-red-400 bg-red-50 text-red-700",
                solved && !isRevealedCorrect && "opacity-60"
              )}
            >
              <span className="mr-2 font-semibold uppercase">{opt.key}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>
      {correct !== null && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className={clsx("text-sm font-medium", solved ? "text-wcmt-green" : "text-red-700")}>
            {solved ? "Correct!" : "Not quite — try again."}
          </p>
          {solved && (
            <Button variant="primary" onClick={next}>
              {index + 1 >= questions.length ? "See results" : "Next question"}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
