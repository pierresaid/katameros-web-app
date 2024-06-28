export const coptic_months = [
  "Thout",
  "Babah",
  "Hatour",
  "Kiahk",
  "Toubah",
  "Amshir",
  "Baramhat",
  "Baramoudah",
  "Bashans",
  "Baounah",
  "Abib",
  "Misra",
  "Nasie",
];

export const getCopticMonth = (monthNumber: number) => {
  return `${coptic_months[monthNumber - 1]}`;
};
