import { motion } from 'framer-motion'

import formatDate from '../../utils/formatDate'
import '../../../sass/pages/board/board-info.scss'

interface BoardInfoProps {
  boardName: string
  users: (
    | {
        img: string
        name: string
        id: string
        role?: string
      }
    | {
        img: undefined
        name: string
        id: string
        role?: string
      }
  )[]
  boardInfo: string
  createdAt: string
}
const BoardInfo = function ({
  boardName,
  boardInfo,
  users,
  createdAt,
}: BoardInfoProps) {
  const author = users?.find(user => user.role === 'admin')
  const { formattedDate } = formatDate(createdAt)

  return (
    <div className="board-info">
      <div className="board-info__header">
        <p>{boardName}</p>
        <img src="/close-gray.svg" alt="close" />
      </div>
      <div className="made-by">
        <img src="/user-light.svg" alt="author" />
        <p>Made by</p>
      </div>
      <div className="author">
        <img src={author?.img || '/user.svg'} alt="author-image" />
        <p className="name">{author!.name}</p>
        <p className="date">on {formattedDate}</p>
      </div>
      <div className="board-info__description">
        <div className="description-header">
          <p>
            <img src="/description.svg" alt="description" />
            description
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="edit-btn"
          >
            <img src="/edit.svg" alt="edit" />
            edit
          </motion.button>
        </div>
        <pre className="description">{boardInfo}</pre>
      </div>
      <div className="team">
        <div className="team__header">
          <img src="/description.svg" alt="team" />
          <p>team</p>
        </div>
      </div>
    </div>
  )
}

export default BoardInfo
