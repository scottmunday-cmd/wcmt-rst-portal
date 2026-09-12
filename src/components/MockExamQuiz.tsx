"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { QuestionPublic } from "@/types/database";

type AnswerKey = "a" | "b" | "c" | "d";

const EXAM_LENGTH = 40;
const PASS_FRACTION = 34 / 40; // matches the real DTMI theory assessment pass mark

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Full-length practice exam, drawn at random from the whole question bank
// (every question written for the 8 tested theory categories lives in
// modules 2-9, so questions_public with no module filter already IS that
// pool) rather than a single module's questions — mirrors the shape of the
// real 40-question, 34-to-pass DTMI theory paper without using any of its
// actual questions (see build_content.py / the workbook paraphrase, never
// the uploaded real exam photos, which stay reference-only for calibration
// and are never copied into this bank).
export function MockExamQuiz() {
  const [pool, setPool] = useState<QuestionPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exam, setExam] = useState<QuestionPublic[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<AnswerKey | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("questions_public").select("*");
      if (cancelled) return;
      if (error) {
        setError("Couldn't load the mock exam question bank yet.");
      } else {
        setPool(data ?? []);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function startExam() {
    if (!pool) return;
    const drawn = shuffle(pool).slice(0, Math.min(EXAM_LENGTH, pool.length));
    setExam(drawn);
    setIndex(0);
    setSelected(null);
    setCorrect(null);
    setScore(0);
    setFinished(false);
  }

  async function choose(letter: AnswerKey) {
    if (!exam || checking || selected) return;
    setSelected(letter);
    setChecking(true);
    const supabase = createClient();
    const q = exam[index];
    const { data, error } = await supabase.rpc("grade_quiz_answer", {
      p_question_id: q.id,
      p_selected: letter,
    });
    setChecking(false);
    if (error) {
      setError("Couldn't check that answer — please try again.");
      setSelected(null);
      return;
    }
    setCorrect(Boolean(data));
    if (data) setScore((s) => s + 1);
  }

  function next() {
    if (!exam) return;
    if (index + 1 >= exam.length) {
      setFinished(true);
      void saveAttempt();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setCorrect(null);
  }

  async function saveAttempt() {
    if (!exam) return;
    try {
      const supabase = createClient();
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .maybeSingle<{ id: string }>();
      if (!student) return;
      const passed = score / exam.length >= PASS_FRACTION;
      await supabase.from("mock_exams").insert({
        student_id: student.id,
        score,
        passed,
      });
    } catch {
      // Best-effort only — the result still displays even if this fails
      // (e.g. a logged-in admin/instructor with no students row).
    }
  }

  if (error) {
    return <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{error}</Card>;
  }

  if (!pool) {
    return <p className="text-sm text-slate-500">Loading the mock exam question bank…</p>;
  }

  if (pool.length === 0) {
    return <p className="text-sm text-slate-500">No questions in the bank yet.</p>;
  }

  const examLength = Math.min(EXAM_LENGTH, pool.length);
  const passMark = Math.ceil(examLength * PASS_FRACTION);

  if (!exam) {
    return (
      <Card>
        <h3 className="font-heading text-lg font-semibold text-wcmt-navy">
          Full-length mock assessment
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {examLength} questions drawn at random from every tested category, just like the real
          DTMI theory paper. You need {passMark} out of {examLength} correct to pass.
        </p>
        <Button variant="primary" className="mt-4" onClick={startExam}>
          Start mock exam
        </Button>
      </Card>
    );
  }

  if (finished) {
    const pct = Math.round((score / exam.length) * 100);
    const passed = score >= passMark;
    return (
      <Card>
        <h3 className="font-heading text-lg font-semibold text-wcmt-navy">Mock exam complete</h3>
        <p className="mt-1 text-sm text-slate-600">
          You scored {score} out of {exam.length} ({pct}%) —{" "}
          <span
            className={clsx(
              "font-semibold",
              passed ? "text-wcmt-green" : "text-red-700"
            )}
          >
            {passed ? "pass" : "not yet a pass"}
          </span>
          .
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This is practice only — question wording and difficulty on the real assessment will
          differ. Use this as a guide for where to focus your remaining study.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setExam(null)}>
          Try another mock exam
        </Button>
      </Card>
    );
  }

  const q = exam[index];
  const options: { key: AnswerKey; text: string }[] = [
    { key: "a", text: q.answer_a },
    { key: "b", text: q.answer_b },
    { key: "c", text: q.answer_c },
    { key: "d", text: q.answer_d },
  ];

  return (
    <Card>
      <p className="text-xs font-semibold uppercase text-wcmt-coastal">
        Question {index + 1} of {exam.length}
      </p>
      <h3 className="mt-1 font-heading font-semibold text-wcmt-navy">{q.question_text}</h3>
      <div className="mt-4 space-y-2">
        {options.map((opt) => {
          const isSelected = selected === opt.key;
          const showAsCorrect = selected !== null && correct !== null && isSelected && correct;
          const showAsWrong = selected !== null && correct !== null && isSelected && !correct;
          return (
            <button
              key={opt.key}
              type="button"
              disabled={selected !== null || checking}
              onClick={() => choose(opt.key)}
              className={clsx(
                "block w-full rounded-md border px-4 py-2 text-left text-sm transition-colors",
                !selected && "border-slate-200 hover:border-wcmt-coastal",
                showAsCorrect && "border-wcmt-green bg-green-50 text-wcmt-green",
                showAsWrong && "border-red-400 bg-red-50 text-red-700",
                selected && !isSelected && "border-slate-200 opacity-60"
              )}
            >
              <span className="mr-2 font-semibold uppercase">{opt.key}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>
      {selected !== null && correct !== null && (
        <div className="mt-4 flex items-center justify-between">
          <p className={clsx("text-sm font-medium", correct ? "text-wcmt-green" : "text-red-700")}>
            {correct ? "Correct!" : "Not quite."}
          </p>
          <Button variant="primary" onClick={next}>
            {index + 1 >= exam.length ? "Finish exam" : "Next question"}
          </Button>
        </div>
      )}
    </Card>
  );
}
