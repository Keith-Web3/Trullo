import { useState } from 'react'
import { BlurhashCanvas } from 'react-blurhash'

interface ImgProps {
  src: string
  blurhash?: string
  alt: string
  onClick?: React.MouseEventHandler<HTMLImageElement>
  className?: string
}

const Img = function ({
  src,
  blurhash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  alt,
  onClick,
  className,
}: ImgProps) {
  const [isImgLoaded, setIsImgLoaded] = useState(false)
  console.log(blurhash)
  return (
    <>
      {!isImgLoaded && <BlurhashCanvas hash={blurhash} punch={1} />}
      <img
        style={{ display: isImgLoaded ? 'block' : 'none' }}
        onLoad={() => setIsImgLoaded(true)}
        src={src}
        alt={alt}
        onClick={onClick}
        className={className}
      />
    </>
  )
}

export default Img
