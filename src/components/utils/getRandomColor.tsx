function getRandomColor() {
  // Generate random RGB values
  const red = Math.floor(Math.random() * 256) // Random value between 0 and 255
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)

  // Convert RGB to hexadecimal format

  return [red, green, blue]
}

export { getRandomColor }
