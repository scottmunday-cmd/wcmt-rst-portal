#!/usr/bin/env python3
"""
Generates an UPDATE script for the small set of existing lessons whose
content text was edited to fold in generic, nobody-owns-them nautical
mnemonics (green to green, red-port-left-in-the-glass, the cardinal-mark
hourglass shape, etc — confirmed generic industry terminology, not any
training provider's proprietary material). This does NOT insert new rows —
it updates the `content` column of specific already-imported lessons,
identified by (module sort_order, lesson sort_order).
"""
import csv

def esc(s):
    return s.replace("'", "''")

def sql_lit(s):
    return "'" + esc(s) + "'"

# (module_sort_order, lesson sort_order) -> updated this round.
EDITED_LESSONS = {
    ("3", "2"),
    ("5", "1"),
    ("5", "2"),
}

with open("lessons.csv") as f:
    rows = list(csv.DictReader(f))

lines = []
lines.append("-- Update existing lesson content to fold in generic nautical mnemonics")
lines.append("-- (green to green, red-port-left-in-the-glass, cardinal hourglass shape,")
lines.append("-- the classic 'green to green or red to red' passing rhyme). Updates only —")
lines.append("-- no new rows, safe to run once against the live database.")
lines.append("do $$")
lines.append("declare")
lines.append("  v_module_id bigint;")
lines.append("begin")

count = 0
for r in rows:
    key = (r["module_sort_order"], r["sort_order"])
    if key not in EDITED_LESSONS:
        continue
    count += 1
    lines.append(f"  select id into v_module_id from modules where sort_order = {int(r['module_sort_order'])};")
    lines.append(f"  if v_module_id is null then raise exception 'module sort_order % not found', {r['module_sort_order']}; end if;")
    lines.append(
        "  update lessons set content = "
        f"{sql_lit(r['content'])} where module_id = v_module_id and sort_order = {int(r['sort_order'])};"
    )

lines.append("end $$;")

with open("update_mnemonics.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"wrote update_mnemonics.sql, {len(lines)} lines, {count} lessons updated")
