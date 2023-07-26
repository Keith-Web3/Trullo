import Button from '../../ui/Button'
import { renderUsers } from '../../utils/renderusers'
import '../../../sass/pages/board/board-header.scss'

interface BoardHeaderProps {
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
  isPrivate: boolean
}
const BoardHeader = function ({ users, isPrivate }: BoardHeaderProps) {
  return (
    <div className="board-header">
      <Button tag>
        <img src={`${isPrivate ? '/private' : '/public'}.svg`} alt="privacy" />
        <span>{isPrivate ? 'Private' : 'Public'}</span>
      </Button>
      <div className="board__users">
        {renderUsers(users)} <div className="add-user">+</div>
      </div>
      <Button tag>
        <img src="/ellipsis.svg" alt="menu" />
        <span>show menu</span>
      </Button>
    </div>
  )
}

export default BoardHeader
