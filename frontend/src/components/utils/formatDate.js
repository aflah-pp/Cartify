export const FormateDate = (intoString) => {
  const date = new Date(intoString);
  return date
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};
