export default function formatDateBR(
  dateStr: string | null | undefined,
): string {
  if (!dateStr) return "-";

  const datePart = dateStr.split("T")[0]; // pega só YYYY-MM-DD
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return "-";

  return `${day}/${month}/${year}`;
}
