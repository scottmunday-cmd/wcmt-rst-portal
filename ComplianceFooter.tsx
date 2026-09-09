// Displays the required "in conjunction with NWTIS / Authorised Provider"
// acknowledgment. Per the compliance requirements in the planning
// conversation, this needs to appear on: header, footer, student portal,
// assessment pages, and certificates — and must never visually dominate
// the WCMT brand. Keep this small and secondary wherever it's placed.
export function ComplianceFooter() {
  return (
    <p className="text-xs text-slate-500">
      In conjunction with{" "}
      <span className="font-semibold">North West Training &amp; Inspection Services (NWTIS)</span>{" "}
      — Authorised Provider
    </p>
  );
}
