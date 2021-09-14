export const getCleanPath = (path) =>
  path.substr(-1, 1) === '/' ? path.substr(0, path.length - 1) : path
