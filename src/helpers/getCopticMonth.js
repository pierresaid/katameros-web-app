const coptic_months = [
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

const getCopticMonth = (monthNumber) => {
  return `${coptic_months[monthNumber - 1]}`;
};

export default getCopticMonth;
