export function percentString(x, y) {
  return (Math.round(x * 100) / y).toFixed(1) + '%'
}
