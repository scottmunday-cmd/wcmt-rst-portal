#!/usr/bin/env python3
"""
Generates a single-lesson UPDATE for Module 1, Lesson 2 ("Theory and
practical: what the assessment actually covers") — reworded the practical-
assessment line to reassure students it's the easy part (trainers teach the
steps on the day) and point their study time at the theory component
instead. Safe to run once against the live database.
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

with open("lessons.csv") as f:
    lesson_rows = list(csv.DictReader(f))

target = next(
    r for r in lesson_rows
    if r["module_sort_order"] == "1" and r["sort_order"] == "2"
)

lines = []
lines.append("-- Module 1, Lesson 2: reworded the practical-assessment line to reassure")
lines.append("-- students and point their study time at the theory component. Safe to run once.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")
lines.append("  select id into v_module_id from modules where sort_order = 1;")
lines.append("  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;")
lines.append(
    "  update lessons set content = "
    f"{sql_lit(target['content'])} where module_id = v_module_id and sort_order = 2;"
)
lines.append("end $$;")

with open("module1_practical_update.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print("wrote module1_practical_update.sql")
