"use client";

import { useEffect, useMemo, useState } from "react";
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

// Splits the whole question bank into a set of fixed, labelled papers, each
// up to EXAM_LENGTH questions — "Practice Exam 1", "Practice Exam 2" and so
// on — so a student can sit several distinct full-length papers rather than
// only ever getting one random draw. Questions are sorted by id first so
// the split is deterministic: the same paper always contains the same
// questions from one visit to the next, which is what lets a student
// meaningfully compare "how did I do on Exam 2 this time".
//
// The bank won't always divide evenly into EXAM_LENGTH-question chunks, so
// the last paper tops itself up by wrapping back to the start of the list
// rather than being left short — that paper alone may share a few questions
// with an earlier one, everything before it is completely distinct.
function buildPapers(pool: QuestionPublic[]): QuestionPublic[][] {
  if (pool.length === 0) return [];
  const sorted = [...pool].sort((a, b) => a.id - b.id);
  if (sorted.length <= EXAM_LENGTH) return [sorted];
  const paperCount = Math.ceil(sorted.length / EXAM_LENGTH);
  const papers: QuestionPublic[][] = [];
  for (let p = 0; p < paperCount; p++) {
    const start = p * EXAM_LENGTH;
    let chunk = sorted.slice(start, start + EXAM_LENGTH);
    if (chunk.length < EXAM_LENGTH) {
      chunk = chunk.concat(sorted.slice(0, EXAM_LENGTH - chunk.length));
    }
    papers.push(chunk);
  }
  return papers;
}

type Selection = { label: string; questions: QuestionPublic[] };

// Practice Exams — a bank of full-length, 40-question papers modelled on
// the real DTMI theory assessment (same 34/40 pass mark), plus a
// quick-shuffle option for extra variety. Every question is paraphrased
// from the workbook (see build_content.py) — never copied from the real
// exam papers Scotty supplied, which stay reference-only for calibration.
export function PracticeExams() {
  const [pool, setPool] = useState<QuestionPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
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
        setError("Couldn't load the practice exam question bank yet.");
      } else {
        setPool(data ?? []);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const papers = useMemo(() => (pool ? buildPapers(pool) : []), [pool]);

  function startPaper(label: string, questions: QuestionPublic[]) {
    setSelection({ label, questions });
    setIndex(0);
    setSelected(null);
    setCorrect(null);
    setScore(0);
    setFinished(false);
  }

  function startRandom() {
    if (!pool) return;
    const drawn = shuffle(pool).slice(0, Math.min(EXAM_LENGTH, pool.length));
    startPaper("Quick Random 40", drawn);
  }

  async function choose(letter: AnswerKey) {
    if (!selection || checking || selected) return;
    setSelected(letter);
    setChecking(true);
    const supabase = createClient();
    const q = selection.questions[index];
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
    if (!selection) return;
    if (index + 1 >= selection.questions.length) {
      setFinished(true);
      void saveAttempt();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setCorrect(null);
  }

  async function saveAttempt() {
    if (!selection) return;
    try {
      const supabase = createClient();
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .maybeSingle<{ id: string }>();
      if (!student) return;
      const passed = score / selection.questions.length >= PASS_FRACTION;
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
    return <p className="text-sm text-slate-500">Loading the practice exam question bank…</p>;
  }

  if (pool.length === 0) {
    return <p className="text-sm text-slate-500">No questions in the bank yet.</p>;
  }

  // --- Hub: choose which paper to sit ---------------------------------
  if (!selection) {
    return (
      <Card>
        <h3 className="font-heading text-lg font-semibold text-wcmt-navy">Practice exams</h3>
        <p className="mt-1 text-sm text-slate-600">
          Each paper below is a full {EXAM_LENGTH}-question exam, just like the real DTMI theory
          test — you need {Math.ceil(EXAM_LENGTH * PASS_FRACTION)} out of {EXAM_LENGTH} correct to
          pass. The numbered papers use a fixed, separate set of questions each, so you can sit
          more than one without seeing the same paper twice (the last paper may share a few
          questions with an earlier one if the bank does not divide evenly). Quick Random 40
          reshuffles the whole bank fresh every time, for extra practice.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {papers.map((paper, i) => (
            <button
              key={i}
              type="button"
              onClick={() => startPaper(`Practice Exam ${i + 1}`, paper)}
              className="rounded-md border border-slate-200 px-4 py-3 text-left text-sm hover:border-wcmt-coastal"
            >
              <span className="block font-semibold text-wcmt-navy">Practice Exam {i + 1}</span>
              <span className="text-xs text-slate-500">{paper.length} questions</span>
            </button>
          ))}
          <button
            type="button"
            onClick={startRandom}
            className="rounded-md border border-dashed border-wcmt-coastal px-4 py-3 text-left text-sm hover:bg-wcmt-bg"
          >
            <span className="block font-semibold text-wcmt-navy">Quick Random 40</span>
            <span className="text-xs text-slate-500">Fresh shuffle every time</span>
          </button>
        </div>
      </Card>
    );
  }

  const exam = selection.questions;
  const examLength = exam.length;
  const passMark = Math.ceil(examLength * PASS_FRACTION);

  if (finished) {
    const pct = Math.round((score / examLength) * 100);
    const passed = score >= passMark;
    return (
      <Card>
        <h3 className="font-heading text-lg font-semibold text-wcmt-navy">
          {selection.label} complete
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          You scored {score} out of {examLength} ({pct}%) —{" "}
          <span className={clsx("font-semibold", passed ? "text-wcmt-green" : "text-red-700")}>
            {passed ? "pass" : "not yet a pass"}
          </span>
          .
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This is practice only — question wording and difficulty on the real assessment will
          differ. Use this as a guide for where to focus your remaining study.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSelection(null)}>
          Choose another exam
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
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-wcmt-coastal">
          {selection.label} — Question {index + 1} of {examLength}
        </p>
        <button
          type="button"
          onClick={() => setSelection(null)}
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Exit
        </button>
      </div>
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
            {index + 1 >= examLength ? "Finish exam" : "Next question"}
          </Button>
        </div>
      )}
    </Card>
  );
}
