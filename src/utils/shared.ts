export const generateKey = (pre: string | number = '') => {
  return `${pre}_${Date.now()}`
}
