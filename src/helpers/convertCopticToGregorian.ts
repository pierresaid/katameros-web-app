// @ts-nocheck
export function convertCopticToGregorian(copticDate) {
  const certainCopticDate = "09/28/1719";
  const certainGregorianDate = "06/05/2003".split("/");

  if (isCopticDate(copticDate)) {
    const days = copticlentDiff(copticDate, certainCopticDate);
    const date = new Date(
      certainGregorianDate[2],
      certainGregorianDate[0] - 1,
      parseInt(certainGregorianDate[1]) + days
    );
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  } else {
    return false;
  }
}

function isCopticDate(copticDate) {
  let isCoptic = true;
  const copticDateExp = copticDate.split("/");
  const firstSlash = copticDate.indexOf("/");
  const lastSlash = copticDate.lastIndexOf("/");

  if (
    firstSlash === -1 ||
    lastSlash === -1 ||
    firstSlash === lastSlash ||
    copticDateExp.length !== 3
  ) {
    isCoptic = false;
  }

  if (isCoptic) {
    const [CMonth, CDay, CYear] = copticDateExp.map(Number);
    if (isNaN(CDay) || isNaN(CMonth) || isNaN(CYear)) {
      isCoptic = false;
    }
  }

  if (isCoptic) {
    const [CMonth, CDay, CYear] = copticDateExp.map(Number);
    if (
      CDay % 1 !== 0 ||
      CMonth % 1 !== 0 ||
      CYear % 1 !== 0 ||
      CDay <= 0 ||
      CMonth <= 0 ||
      CYear <= 0
    ) {
      isCoptic = false;
    }
  }

  if (isCoptic) {
    const [CMonth, CDay, CYear] = copticDateExp.map(Number);
    if (
      CDay > 30 ||
      CMonth > 13 ||
      (CDay > 6 && CMonth === 13 && isleap(CYear, "C")) ||
      (CDay > 5 && CMonth === 13 && !isleap(CYear, "C"))
    ) {
      isCoptic = false;
    }
  }

  return isCoptic;
}

function copticlentDiff(copticDate1, copticDate2) {
  if (isCopticDate(copticDate1) && isCopticDate(copticDate2)) {
    let year1 = getCopticYear(copticDate1);
    let year2 = getCopticYear(copticDate2);
    let month1 = getCopticMonth(copticDate1);
    let month2 = getCopticMonth(copticDate2);
    let day1 = getCopticDay(copticDate1);
    let day2 = getCopticDay(copticDate2);
    let diff = 0;

    if (year1 > year2) {
      if (year1 - year2 > 1) {
        while (year1 - year2 > 1) {
          diff += 365;
          if (isleap(year2, "C")) {
            diff++;
          }
          year2++;
        }
        copticDate2 = `${month2}/${day2}/${year2}`;
      }

      while (copticDate1 !== copticDate2) {
        copticDate2 = copticDateAdd(copticDate2, 1);
        diff++;
      }
    } else if (year1 < year2) {
      if (year2 - year1 > 1) {
        while (year2 - year1 > 1) {
          diff += 365;
          if (isleap(year1, "C")) {
            diff++;
          }
          year1++;
        }
        copticDate1 = `${month1}/${day1}/${year1}`;
      }

      while (copticDate1 !== copticDate2) {
        copticDate1 = copticDateAdd(copticDate1, 1);
        diff++;
      }
      diff *= -1;
    } else {
      if (month1 > month2 || (month1 === month2 && day1 > day2)) {
        while (copticDate1 !== copticDate2) {
          copticDate2 = copticDateAdd(copticDate2, 1);
          diff++;
        }
      } else if (month1 < month2 || (month1 === month2 && day1 < day2)) {
        while (copticDate1 !== copticDate2) {
          copticDate1 = copticDateAdd(copticDate1, 1);
          diff++;
        }
        diff *= -1;
      }
    }
    return diff;
  } else {
    return false;
  }
}

function getCopticDay(copticDate) {
  if (isCopticDate(copticDate)) {
    return parseInt(copticDate.split("/")[1]);
  }
  return 0;
}

function getCopticMonth(copticDate) {
  if (isCopticDate(copticDate)) {
    return parseInt(copticDate.split("/")[0]);
  }
  return 0;
}

function getCopticYear(copticDate) {
  if (isCopticDate(copticDate)) {
    return parseInt(copticDate.split("/")[2]);
  }
  return 0;
}

function copticDateAdd(copticDate, number) {
  if (isCopticDate(copticDate)) {
    let CDay = getCopticDay(copticDate);
    let CMonth = getCopticMonth(copticDate);
    let CYear = getCopticYear(copticDate);

    if (number > 0) {
      for (let i = 0; i < number; i++) {
        CDay++;
        if (CDay === 31) {
          CDay = 1;
          CMonth++;
        }

        if (
          (CMonth === 13 && CDay === 7 && isleap(CYear, "C")) ||
          (CMonth === 13 && CDay === 6 && !isleap(CYear, "C"))
        ) {
          CDay = 1;
          CMonth = 1;
          CYear++;
        }
      }
    } else if (number < 0) {
      for (let i = 0; i > number; i--) {
        CDay--;
        if (CDay === 0) {
          CDay = 30;
          CMonth--;
        }

        if (CMonth === 0 && CDay === 30 && isleap(CYear - 1, "C")) {
          CDay = 6;
          CMonth = 13;
          CYear--;
        }

        if (CMonth === 0 && CDay === 30 && !isleap(CYear - 1, "C")) {
          CDay = 5;
          CMonth = 13;
          CYear--;
        }
      }
    }
    return `${CMonth}/${CDay}/${CYear}`;
  } else {
    return false;
  }
}

function isleap(year, calendar) {
  let leap = false;
  const localYear = parseInt(year);

  if (calendar.toUpperCase() === "C") {
    const leapcheck = (localYear + 1) / 4;
    leap = leapcheck === Math.floor(leapcheck);
  } else if (calendar.toUpperCase() === "G") {
    leap = (localYear % 4 === 0 && localYear % 100 !== 0) || localYear % 400 === 0;
  }

  return leap;
}
