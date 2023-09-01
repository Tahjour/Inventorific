export function getFormattedDate() {
  // Create a new Date object for the current date and time
  const currentDate = new Date();
  // Get the day, month, and year
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
  const year = currentDate.getFullYear();

  // Format the date as a string
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

export function getFormattedTime() {
  // Create a new Date object for the current date and time
  const currentDate = new Date();
  // Get the hours, minutes, and seconds
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, "0"); // Pad start to always have 2 digits
  const seconds = currentDate.getSeconds().toString().padStart(2, "0"); // Pad start to always have 2 digits

  // Convert hours from 24-hour clock to 12-hour clock format
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes}:${seconds} ${period}`;
}
