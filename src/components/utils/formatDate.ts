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

export function formatTimestamp(timestamp: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-US', options)

  const day = date.getDate()
  const month = formattedDate.split(' ')[0]
  const time = formattedDate.split(' ')[3]

  return `${day} ${month} at ${time}`
}

export default formatDate
