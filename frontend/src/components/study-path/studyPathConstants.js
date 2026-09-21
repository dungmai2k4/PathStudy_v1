export const ENGLISH_SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
export const FONT = "'Times New Roman', Times, Georgia, serif";

export const formatDateTime = (att) => {
  const ts = att?.submittedAt || att?.createdAt || att?.startedAt;
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${mins} ${day}/${month}/${year}`;
  } catch {
    return '—';
  }
};
