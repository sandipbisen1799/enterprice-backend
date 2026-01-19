export const calculateProgress = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const completed = now - start;

  return Math.round((completed / total) * 100);
};
