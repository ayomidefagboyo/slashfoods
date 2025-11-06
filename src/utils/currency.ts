/**
 * Format amount to Nigerian Naira
 * @param amount - The amount to format
 * @returns Formatted string with ₦ symbol
 */
export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage
 */
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
