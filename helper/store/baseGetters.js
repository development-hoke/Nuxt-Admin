export const data = ({ data }) => data
export const find = ({ data }) => (searchId, keyName = 'id') =>
  data.find((item) => Number(item[keyName]) === Number(searchId))
