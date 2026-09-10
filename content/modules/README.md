# Content goes here first, not in the database

Draft the 11 modules' lessons and quiz questions as two spreadsheets
(Google Sheets or Excel is fine) before typing anything into an admin
screen — see "Content migration plan" in the Technical Build Pack.

1. **Lessons sheet** — columns: `module_sort_order`, `title`, `content`,
   `video_url` (optional), `sort_order`.
2. **Questions sheet** — columns: `module_sort_order`, `question_text`,
   `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`
   (a/b/c/d), `difficulty` (easy/normal/hard).

Export each sheet as CSV into this folder, then run:

```
npm run import-content -- content/modules/lessons.csv content/modules/questions.csv
```

Re-running is safe for adding new rows; it does not currently de-duplicate
edits to existing rows (the build pack notes this as a v1 simplification).
