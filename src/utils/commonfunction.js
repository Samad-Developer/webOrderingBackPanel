export function convertToDateFormat(dateTimeString) {
  if (dateTimeString) return (dateTimeString?.split("T"))[0];
}
