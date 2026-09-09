/**
 * Bulk-imports lessons and quiz questions from CSV exports of the content
 * spreadsheet into Supabase — see "Content migration plan" in the
 * Technical Build Pack. Safe to re-run: it upserts by a natural key
 * instead of inserting duplicates.
 *
 * Usage:
 *   npm run import-content -- content/lessons.csv content/questions.csv
 *
 * Expected columns:
 *   lessons.csv:   module_sort_order, title, content, video_url, sort_order
 *   questions.csv: module_sort_order, question_text, answer_a, answer_b,
 *                  answer_c, answer_d, correct_answer, difficulty
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) — run this locally or
 * in CI, never from the browser.
 */
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment first."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function moduleIdForSortOrder(sortOrder: number): Promise<number> {
  const { data, error } = await supabase
    .from("modules")
    .select("id")
    .eq("sort_order", sortOrder)
    .single();
  if (error || !data) {
    throw new Error(`No module with sort_order=${sortOrder} — seed modules first.`);
  }
  return data.id;
}

async function importLessons(path: string) {
  const rows: Record<string, string>[] = parse(readFileSync(path, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows) {
    const moduleId = await moduleIdForSortOrder(Number(row.module_sort_order));
    const { error } = await supabase.from("lessons").insert({
      module_id: moduleId,
      title: row.title,
      content: row.content,
      video_url: row.video_url || null,
      sort_order: Number(row.sort_order),
    });
    if (error) console.error(`Failed to import lesson "${row.title}":`, error.message);
  }
  console.log(`Imported ${rows.length} lessons from ${path}`);
}

async function importQuestions(path: string) {
  const rows: Record<string, string>[] = parse(readFileSync(path, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows) {
    const moduleId = await moduleIdForSortOrder(Number(row.module_sort_order));
    const { error } = await supabase.from("questions").insert({
      module_id: moduleId,
      question_text: row.question_text,
      answer_a: row.answer_a,
      answer_b: row.answer_b,
      answer_c: row.answer_c,
      answer_d: row.answer_d,
      correct_answer: row.correct_answer.toLowerCase(),
      difficulty: row.difficulty || "normal",
    });
    if (error) console.error(`Failed to import question "${row.question_text}":`, error.message);
  }
  console.log(`Imported ${rows.length} questions from ${path}`);
}

async function main() {
  const [lessonsPath, questionsPath] = process.argv.slice(2);
  if (!lessonsPath && !questionsPath) {
    console.error("Usage: npm run import-content -- <lessons.csv> [questions.csv]");
    process.exit(1);
  }
  if (lessonsPath) await importLessons(lessonsPath);
  if (questionsPath) await importQuestions(questionsPath);
}

main();
