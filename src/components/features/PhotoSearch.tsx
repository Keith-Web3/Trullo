import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'

import '../../sass/features/photo-search.scss'
import Loader from '../ui/Loader'
import useFetchPhotos from '../hooks/useFetchPhotos'
import Img from '../ui/Img'

interface PhotoSearchProps {
  setCoverSrc: React.Dispatch<React.SetStateAction<string>>
  setCoverBlurHash: React.Dispatch<React.SetStateAction<string>>
}

const visibilityAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const PhotoSearch = function (
  { setCoverSrc, setCoverBlurHash }: PhotoSearchProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [searchQuery, setSearchQuery, getPhotos] = useFetchPhotos()
  const searchBar = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryFn: getPhotos,
    queryKey: ['photo-search', searchQuery],
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    searchBar.current!.focus()
  }, [])

  return (
    <motion.div
      {...visibilityAnimation}
      ref={ref}
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
          <Loader />
        ) : (
          data?.map((el: any) => (
            <div key={el.blur_hash}>
              <Img
                onClick={() => {
                  setCoverSrc(el.urls.regular)
                  setCoverBlurHash(el.blur_hash)
                  fetch(
                    el.links.download_location +
                      `?utm_source=thullo&utm_medium=referral&client_id=${
                        import.meta.env.VITE_UNSPLASH_KEY
                      }`
                  )
                }}
                blurhash={el.blur_hash || 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
                src={el.urls.regular}
                alt="random_image"
              />
              <a
                href={
                  el.user.links.html + '?utm_source=thullo&utm_medium=referral'
                }
                title={`By ${el.user.name} on unsplash`}
              >
                By {el.user.name} on unsplash
              </a>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default forwardRef(PhotoSearch)
