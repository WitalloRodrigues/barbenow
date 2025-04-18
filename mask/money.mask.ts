export const moneyMask = (value: string) => {
  const numericValue = value.replace(/\D/g, '')

  const number = parseFloat(numericValue) / 100

  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
