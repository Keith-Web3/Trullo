const formatDate = function (timestamp: string) {
  const date = new Date(timestamp)

  // Format for 'Friday, 2:04pm'
  const optionsTime: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const formattedTime = date.toLocaleString(undefined, optionsTime)

  // Format for 'Sep 20, 2024'
  const optionsDate: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const formattedDate = date.toLocaleString(undefined, optionsDate)

  return { formattedTime, formattedDate }
}

export default formatDate
