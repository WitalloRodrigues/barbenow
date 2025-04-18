export const onlyNumbers = (number: string | undefined | null) =>
  number ? String(number).replace(/\D/g, '') : ''
