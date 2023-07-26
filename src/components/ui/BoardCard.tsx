import { Link } from 'react-router-dom'
import '../../sass/ui/boardcard.scss'
import { renderUsers } from '../utils/renderusers'

interface BoardCardProps {
  name: string
  image: string
  users: (
    | {
        image: string
        name: string
      }
    | {
        image: null
        name: string
      }
  )[]
  id: number
}
const BoardCard = function ({ name, image, users, id }: BoardCardProps) {
  const displayedUsers = renderUsers(users.slice(0, 3))
  const isUsersLong = users.length > 3

  return (
    <Link to={`board/${id}`} className="board-card" state={{ name }}>
      <img src={image} className="board-card__image" alt="project" />
      <p>{name}</p>
      <div className="users">
        {displayedUsers} {isUsersLong && `+${users.length - 3} others`}
      </div>
    </Link>
  )
}

export default BoardCard
