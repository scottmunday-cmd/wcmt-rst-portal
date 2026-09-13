#!/usr/bin/env python3
"""
Incremental import #3: adds the new quiz-bank questions written to support
multiple distinct 40-question Practice Exam papers (see PracticeExams.tsx).
No new lessons this round — only new `questions` rows, skipping past the
rows already live in the database from the two previous imports.
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

# module_sort_order -> how many of the FIRST rows in questions.csv for that
# module were already imported (skip these; insert the rest).
ALREADY_IMPORTED_QUESTION_COUNT = {
    "2": 9,
    "3": 6,
    "4": 8,
    "5": 9,
    "6": 5,
    "7": 9,
    "8": 9,
    "9": 6,
}

lines = []
lines.append("-- Incremental content import #3: new quiz-bank questions only,")
lines.append("-- added to support multiple distinct Practice Exam papers.")
lines.append("-- Safe to run once against a database that already has the rows from")
lines.append("-- import.sql and increment_nav_iala.sql — this does not touch those.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

with open("questions.csv") as f:
    qrows = list(csv.DictReader(f))

seen_count = {}
inserted = 0
for r in qrows:
    mod = r["module_sort_order"]
    if mod not in ALREADY_IMPORTED_QUESTION_COUNT:
        continue
    seen_count[mod] = seen_count.get(mod, 0) + 1
    if seen_count[mod] <= ALREADY_IMPORTED_QUESTION_COUNT[mod]:
        continue  # already imported previously — skip
    inserted += 1
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(mod)};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {mod}; end if;")
    lines.append(
        "  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values "
        f"(v_module_id, {sql_lit(r['question_text'])}, {sql_lit(r['answer_a'])}, {sql_lit(r['answer_b'])}, "
        f"{sql_lit(r['answer_c'])}, {sql_lit(r['answer_d'])}, {sql_lit(r['correct_answer'])}, {sql_lit(r['difficulty'])});"
    )

lines.append("end $$;")

with open("increment_quizbank_v3.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"wrote increment_quizbank_v3.sql, {len(lines)} lines, {inserted} new questions")
