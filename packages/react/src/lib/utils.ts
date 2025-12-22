export const formatCurrency = (value?: string, defaultValue?: string): string => {
    if (!value) return defaultValue || '';

    const [currency, amount] = value.split(',');

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.trim(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return formatter.format(parseFloat(amount) / 100);
}