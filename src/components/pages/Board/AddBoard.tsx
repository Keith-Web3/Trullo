import Button from '../../ui/Button'
import '../../../sass/pages/board/add-board.scss'

interface AddCardProps {
  setIsAddCardModalShown: React.Dispatch<React.SetStateAction<boolean>>
}

const AddBoard = function ({ setIsAddCardModalShown }: AddCardProps) {
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
        <Button tag>
          <img src="/gallery.svg" alt="gallery" />
          <span>Cover</span>
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
