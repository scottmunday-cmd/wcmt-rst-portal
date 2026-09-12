#!/usr/bin/env python3
"""
Generates an INCREMENTAL import script for content added to modules that
were already imported once (so we must not re-run the full import.sql,
which has no unique constraint to stop it from duplicating every existing
row). Only inserts the specific new lesson/question rows listed below.
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

# (module_sort_order, lesson sort_order) pairs that are NEW this round.
NEW_LESSONS = {
    ("4", "3"),
    ("4", "4"),
    ("5", "4"),
}

# module_sort_order -> how many of the FIRST rows in questions.csv for that
# module were already imported (skip these; insert the rest).
ALREADY_IMPORTED_QUESTION_COUNT = {
    "4": 1,
    "5": 2,
}
NEW_QUESTION_MODULES = set(ALREADY_IMPORTED_QUESTION_COUNT)

lines = []
lines.append("-- Incremental content import: NEW Navigation Lights + IALA Buoyage rows only.")
lines.append("-- Safe to run once against a database that already has the original")
lines.append("-- module 4 (2 lessons, 1 question) and module 5 (3 lessons, 2 questions) rows —")
lines.append("-- this script does NOT touch those, it only adds the new ones below.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

with open("lessons.csv") as f:
    rows = list(csv.DictReader(f))

for r in rows:
    key = (r["module_sort_order"], r["sort_order"])
    if key not in NEW_LESSONS:
        continue
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    video = "null" if not r["video_url"] else sql_lit(r["video_url"])
    lines.append(
        "  insert into lessons (module_id, title, content, video_url, sort_order) values "
        f"(v_module_id, {sql_lit(r['title'])}, {sql_lit(r['content'])}, {video}, {int(r['sort_order'])});"
    )

with open("questions.csv") as f:
    qrows = list(csv.DictReader(f))

seen_count = {}
for r in qrows:
    mod = r["module_sort_order"]
    if mod not in NEW_QUESTION_MODULES:
        continue
    seen_count[mod] = seen_count.get(mod, 0) + 1
    if seen_count[mod] <= ALREADY_IMPORTED_QUESTION_COUNT[mod]:
        continue  # already imported previously — skip
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(mod)};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {mod}; end if;")
    lines.append(
        "  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values "
        f"(v_module_id, {sql_lit(r['question_text'])}, {sql_lit(r['answer_a'])}, {sql_lit(r['answer_b'])}, "
        f"{sql_lit(r['answer_c'])}, {sql_lit(r['answer_d'])}, {sql_lit(r['correct_answer'])}, {sql_lit(r['difficulty'])});"
    )

lines.append("end $$;")

with open("increment_nav_iala.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print("wrote increment_nav_iala.sql,", len(lines), "lines")
