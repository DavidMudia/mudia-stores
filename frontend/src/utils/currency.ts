export const CURRENCY = '₦';

export const formatPrice = (amount: number) => {
  return `${CURRENCY}${amount.toFixed(2)}`;
};