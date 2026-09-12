#!/usr/bin/env python3
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

lines = []
lines.append("-- Auto-generated content import: lessons + questions")
lines.append("-- Source: content/modules/lessons.csv, questions.csv (build_content.py)")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

with open("lessons.csv") as f:
    rows = list(csv.DictReader(f))

for r in rows:
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    video = "null" if not r["video_url"] else sql_lit(r["video_url"])
    lines.append(
        "  insert into lessons (module_id, title, content, video_url, sort_order) values "
        f"(v_module_id, {sql_lit(r['title'])}, {sql_lit(r['content'])}, {video}, {int(r['sort_order'])});"
    )

with open("questions.csv") as f:
    qrows = list(csv.DictReader(f))

for r in qrows:
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    lines.append(
        "  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values "
        f"(v_module_id, {sql_lit(r['question_text'])}, {sql_lit(r['answer_a'])}, {sql_lit(r['answer_b'])}, "
        f"{sql_lit(r['answer_c'])}, {sql_lit(r['answer_d'])}, {sql_lit(r['correct_answer'])}, {sql_lit(r['difficulty'])});"
    )

lines.append("end $$;")

with open("import.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print("wrote import.sql,", len(lines), "lines")
