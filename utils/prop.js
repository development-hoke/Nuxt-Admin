export const getThumbnailImageUrl = (item) =>
  Array.isArray(item.itemImages) && item.itemImages.length > 0
    ? item.itemImages[0].urlM
    : null

export const splitDatetime = (datetime) => {
  if (!datetime) {
    return [null, null]
  }

  return datetime.split(' ')
}
