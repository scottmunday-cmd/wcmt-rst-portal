#!/usr/bin/env python3
"""
Generates an UPDATE + INSERT script for the Module 1 age-rules request:
 - updates the content of lesson (module sort_order 1, lesson sort_order 1)
   to spell out the exact ages for towing a water skier (17), acting as
   observer (14), and supervising a non-RST-holder as the responsible
   skipper (18, any environment).
 - inserts a new starter question bank for Module 1 covering these exact
   ages (module 1 previously had none), since these ages come up often in
   the real DTMI assessment.
Safe to run once against the live database — updates the one lesson, and
adds only the module 1 questions listed below (re-running would duplicate
those question rows, since there's no de-dupe check, same as the initial
import).
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

EDITED_LESSONS = {
    ("1", "1"),
}

with open("lessons.csv") as f:
    lesson_rows = list(csv.DictReader(f))

with open("questions.csv") as f:
    question_rows = list(csv.DictReader(f))

lines = []
lines.append("-- Module 1 age-rules update: expands the towing/observer/supervising-skipper")
lines.append("-- age rules in lesson 1, and adds Module 1's first practice question bank")
lines.append("-- covering those exact ages. Safe to run once against the live database.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

lesson_count = 0
for r in lesson_rows:
    key = (r["module_sort_order"], r["sort_order"])
    if key not in EDITED_LESSONS:
        continue
    lesson_count += 1
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    lines.append(
        "  update lessons set content = "
        f"{sql_lit(r['content'])} where module_id = v_module_id and sort_order = {int(r['sort_order'])};"
    )

question_count = 0
for r in question_rows:
    if r["module_sort_order"] != "1":
        continue
    question_count += 1
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    lines.append(
        "  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values "
        f"(v_module_id, {sql_lit(r['question_text'])}, {sql_lit(r['answer_a'])}, {sql_lit(r['answer_b'])}, "
        f"{sql_lit(r['answer_c'])}, {sql_lit(r['answer_d'])}, {sql_lit(r['correct_answer'])}, {sql_lit(r['difficulty'])});"
    )

lines.append("end $$;")

with open("module1_age_rules_update.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"wrote module1_age_rules_update.sql — {lesson_count} lesson(s) updated, {question_count} question(s) inserted")
