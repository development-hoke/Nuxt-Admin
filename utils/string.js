export const isEmptyString = (value) =>
  value === null || value === undefined || !String(value).trim()
