export function startOfWeekDate(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diffToMon = (day === 0 ? -6 : 1) - day; 
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMon);
  monday.setHours(0,0,0,0);
  return monday;
}
