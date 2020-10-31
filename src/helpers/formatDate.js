const formatDate = d => {
  let dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d);
  return `${da}-${mo}-${ye}`;
};

export default formatDate;
