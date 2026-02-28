export function formatDate(inputDate) {
  if (!inputDate) return;
  // Split the input date string into date and time parts
  const [datePart, timePart] = inputDate.split("T");

  // Extract the year, month, and day from the date part
  const [year, month, day] = datePart.split("-");

  // Extract the hour, minute, and second from the time part
  const [timeWithoutMs] = timePart.split(".");
  const [hour, minute] = timeWithoutMs.split(":");

  // Format the date and time components into the desired format
  const formattedDate = `${day}:${month}:${year} : ${hour}:${minute}`;

  return formattedDate;
}
