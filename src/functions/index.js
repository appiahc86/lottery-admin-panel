export const formatNumber = (amount) => {
    const f = new Intl.NumberFormat("en-us", {
        maximumFractionDigits: 2
    })
    return f.format(amount);
}