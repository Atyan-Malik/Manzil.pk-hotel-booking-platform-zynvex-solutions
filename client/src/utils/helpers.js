export const formatPKR = (amount) => `PKR ${Number(amount || 0).toLocaleString("en-PK")}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
