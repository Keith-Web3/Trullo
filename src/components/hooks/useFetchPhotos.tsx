import { useState } from 'react'

type hookType = () => [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  () => Promise<any>
]

const useFetchPhotos: hookType = function () {
  const [searchQuery, setSearchQuery] = useState('collaboration')

  const getPhotos = async function () {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?client_id=${
        import.meta.env.VITE_UNSPLASH_KEY
      }&page=1&query=${searchQuery.trim()}&per_page=12`
    )
    const data = await res.json()
    return data.results
  }
  return [searchQuery, setSearchQuery, getPhotos]
}

export default useFetchPhotos
