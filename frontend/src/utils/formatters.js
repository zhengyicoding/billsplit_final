/* Format a numeric value as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  const absAmount = Math.abs(parseFloat(amount) || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);
};

/**
 * Format a date to a readable string
 * @param {string|Date} dateInput - The date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Default options
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Merge with provided options
  const formattingOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat("en-US", formattingOptions).format(date);
};
