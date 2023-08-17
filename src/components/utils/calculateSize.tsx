export default function (sizeInBytes: number) {
  if (sizeInBytes <= 1024) {
    return `${sizeInBytes}b`
  } else if (sizeInBytes > 1024 && sizeInBytes <= 1048576) {
    const size = sizeInBytes / 1024
    return `${Math.round(size)}KB`
  } else if (sizeInBytes > 1048576 && sizeInBytes <= 1073741824) {
    const size = sizeInBytes / 1048576
    return `${size.toPrecision(2)}MB`
  } else {
    const size = sizeInBytes / 1099511627776
    return `${size.toPrecision(2)}GB`
  }
}
