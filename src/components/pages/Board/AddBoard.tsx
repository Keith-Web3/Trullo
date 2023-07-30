import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Button from '../../ui/Button'
import '../../../sass/pages/board/add-board.scss'
import PhotoSearch from '../../features/PhotoSearch'

interface AddCardProps {
  setIsAddCardModalShown: React.Dispatch<React.SetStateAction<boolean>>
}

const AddBoard = function ({ setIsAddCardModalShown }: AddCardProps) {
  const [isSearchModalShown, setIsSearchModalShown] = useState(false)
  return (
    <div className="add-board">
      <div className="cover-photo">
        <img
          src="/close.svg"
          alt="close"
          className="close-btn"
          onClick={() => setIsAddCardModalShown(prev => !prev)}
        />
        <img
          className="cover-img"
          src="https://source.unsplash.com/random/?collaboration"
          alt="random-unsplash-photo"
        />
      </div>
      <input type="text" placeholder="Add board title" />
      <div className="btn-container">
        <Button tag onClick={() => setIsSearchModalShown(true)}>
          <img src="/gallery.svg" alt="gallery" />
          <span>Cover</span>
          <AnimatePresence>
            {isSearchModalShown && <PhotoSearch />}
          </AnimatePresence>
        </Button>
        <Button tag>
          <img src="/private.svg" alt="private" />
          <span>Private</span>
        </Button>
      </div>
      <div className="footer">
        <button>Cancel</button>
        <button>
          <span>+</span> Create
        </button>
      </div>
    </div>
  )
}

export default AddBoard
