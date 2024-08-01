export const getDateTime = (DATE) => {
  let date = new Date(DATE);
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    "." +
    date.getMilliseconds()
  );
};
export const getDate = (DATE = Date.now(), seperator = "-") => {
  let date = new Date(DATE);
  return (
    date.getFullYear() +
    seperator +
    (date.getMonth() + 1) +
    seperator +
    date.getDate()
  );
};
export const formatDateFunction = (date, para) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join(para);
};

export const getFullTime = (DATE) => {
  let date = new Date(DATE);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    "." +
    date.getMilliseconds()
  );
};
export const getTime = (DATE, seperator = ":") => {
  let date = new Date(DATE);
  return (
    date.getHours() +
    seperator +
    date.getMinutes() +
    seperator +
    date.getSeconds()
  );
};

export const compareDate = (date1, date2) => {
  if (date1 < date2) return true;
  else return false;
};

export const compareTime = (time1, time2) => {
  if (time1 < time2) return true;
  else if (time1 > time2) return false;
  else return false;
};

export const dateformatFunction = (date, para = "-") => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join(para);
};
