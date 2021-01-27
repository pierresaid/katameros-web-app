const formatDate = (d) => {
  // let dtf = new Intl.DateTimeFormat("en", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  // });
  // const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d);
  // return `${da}-${mo}-${ye}`;
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return `${day}-${month}-${year}`;
};

export default formatDate;
