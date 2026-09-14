#!/usr/bin/env python3
"""
Generates an UPDATE + INSERT script for the "align lessons with the real
exam papers" pass: cross-checked Modules 2 and 7 against the official RST
workbook text and a set of past assessment papers (Red/Green/Blue/Yellow/
Black), and patched every verified gap or trap (duty to assist exceptions,
the 15m-vs-50m speed distinction, the zero-tolerance oil/plastic dumping
rule, crab-pot/PWC/water-skiing rules, fire extinguisher and anchor detail,
distress signals). Safe to run once against the live database:
 - updates the content (and, for one lesson, the title) of existing lessons
 - inserts one brand-new lesson (Module 2, "Water skiing rules") that didn't
   exist before this pass
Re-running would duplicate the inserted lesson, same as other one-off
scripts in this folder — there's no de-dupe check.
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

# (module_sort_order, lesson sort_order) -> content updated this round.
UPDATED_LESSONS = {
    ("2", "1"),
    ("2", "2"),
    ("2", "3"),
    ("2", "4"),
    ("7", "3"),
    ("7", "4"),
}
# Of those, which also need their title updated (old title -> new title
# means matching by sort_order, not by the old title text).
TITLE_ALSO_CHANGED = {("2", "4")}
# Brand-new lesson this round (module sort_order, lesson sort_order).
NEW_LESSONS = {("2", "5")}

with open("lessons.csv") as f:
    lesson_rows = list(csv.DictReader(f))

lines = []
lines.append("-- Exam-alignment pass: patches Module 2 and Module 7 lesson content against")
lines.append("-- the official RST workbook and a set of past assessment papers. Updates 6")
lines.append("-- existing lessons (one also gets a new title) and inserts 1 new lesson.")
lines.append("-- Safe to run once against the live database.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

update_count = 0
insert_count = 0
for r in lesson_rows:
    key = (r["module_sort_order"], r["sort_order"])
    if key not in UPDATED_LESSONS and key not in NEW_LESSONS:
        continue
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    if key in NEW_LESSONS:
        insert_count += 1
        lines.append(
            "  insert into lessons (module_id, title, content, video_url, sort_order) values "
            f"(v_module_id, {sql_lit(r['title'])}, {sql_lit(r['content'])}, null, {int(r['sort_order'])});"
        )
    else:
        update_count += 1
        if key in TITLE_ALSO_CHANGED:
            lines.append(
                "  update lessons set title = "
                f"{sql_lit(r['title'])}, content = {sql_lit(r['content'])} "
                f"where module_id = v_module_id and sort_order = {int(r['sort_order'])};"
            )
        else:
            lines.append(
                "  update lessons set content = "
                f"{sql_lit(r['content'])} where module_id = v_module_id and sort_order = {int(r['sort_order'])};"
            )

lines.append("end $$;")

with open("exam_alignment_update.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"wrote exam_alignment_update.sql — {update_count} lesson(s) updated, {insert_count} lesson(s) inserted")
