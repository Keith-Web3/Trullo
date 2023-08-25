import { Link } from 'react-router-dom'

import '../../../sass/pages/homepage/boardcard.scss'
import { renderUsers } from '../../utils/renderusers'
import Img from '../../ui/Img'

interface BoardCardProps {
  name: string
  image: string
  blurhash: string
  users: (
    | {
        img: string
        name: string
      }
    | {
        img: undefined
        name: string
      }
  )[]
  id: number
}
const BoardCard = function ({
  name,
  image,
  users,
  id,
  blurhash,
}: BoardCardProps) {
  const displayedUsers = renderUsers(users.slice(0, 3))
  const isUsersLong = users.length > 3

  return (
    <Link to={`board/${id}`} className="board-card" state={{ name }}>
      <Img
        src={image}
        blurhash={blurhash || undefined}
        className="board-card__image"
        alt="project"
      />
      <p>{name}</p>
      <div className="users">
        {displayedUsers} {isUsersLong && `+${users.length - 3} others`}
      </div>
    </Link>
  )
}

export default BoardCard
