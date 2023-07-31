import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { nanoid } from 'nanoid'

import '../../sass/features/photo-search.scss'
import Loader from '../ui/Loader'

interface PhotoSearchProps {
  setCoverSrc: React.Dispatch<React.SetStateAction<string>>
}

const visibilityAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const PhotoSearch = function ({ setCoverSrc }: PhotoSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchBar = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryFn: async function () {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_KEY
        }&page=1&query=${searchQuery.trim() || 'collaboration'}&per_page=12`
      )
      return res.json()
    },
    queryKey: ['photo-search', searchQuery],
    refetchOnWindowFocus: false,
  })

  return (
    <motion.div
      {...visibilityAnimation}
      key="photo-search"
      className="photo-search"
      onClick={e => e.stopPropagation()}
    >
      <h1>photo search</h1>
      <p>Search Unsplash for photos</p>
      <label htmlFor="search">
        <input
          ref={searchBar}
          onKeyDown={e => {
            if (e.key !== 'Enter') return
            setSearchQuery((e.target as HTMLInputElement).value)
          }}
          type="text"
          placeholder="Keywords..."
        />
        <img
          src="/search.svg"
          alt="search"
          onClick={() => setSearchQuery(searchBar.current!.value)}
        />
      </label>
      <div className="images">
        {isLoading ? (
          <Loader
            width="24px"
            ringWidth="3px"
            loaderColor="#ffffff"
            ringColor="#2f80ed"
          />
        ) : (
          data.results?.map((el: any) => (
            <img
              key={nanoid()}
              onClick={() => setCoverSrc(el.urls.regular)}
              src={el.urls.regular}
              alt="random_image"
            />
          ))
        )}
      </div>
    </motion.div>
  )
}

export default PhotoSearch
