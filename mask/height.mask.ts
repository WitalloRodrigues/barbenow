export const heightMask = (value: string) => {
  const numericValue = value.replace(/\D/g, '')

  const number = parseFloat(numericValue) / 100

  return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
