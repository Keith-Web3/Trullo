export default function (sizeInKb: number) {
  if (sizeInKb <= 1048576) {
    const size = sizeInKb / 1024
    return `${Math.round(size)}KB`
  } else if (sizeInKb > 1048576 && sizeInKb <= 1073741824) {
    const size = sizeInKb / 1048576
    return `${size.toPrecision(2)}MB`
  } else {
    const size = sizeInKb / 1099511627776
    return `${size.toPrecision(2)}GB`
  }
}
