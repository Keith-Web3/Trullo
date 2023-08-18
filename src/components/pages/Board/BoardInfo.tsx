import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import formatDate from '../../utils/formatDate'
import '../../../sass/pages/board/board-info.scss'
import { getBoard } from '../../utils/apis'
import Loader from '../../ui/Loader'
import Description from '../../features/Task/Description'
import Button from '../../ui/Button'

const BoardInfo = function () {
  const params = useParams()
  const { isLoading, data } = useQuery({
    queryKey: ['get-board', params.boardId],
    queryFn: getBoard(+params.boardId!),
  })
  const author = data?.[0].users?.find(
    (user: { role: string }) => user.role === 'admin'
  )
  const { formattedDate } = formatDate(data?.[0].created_at)

  return isLoading ? (
    <Loader />
  ) : (
    <div className="board-info">
      <div className="board-info__header">
        <p>{data?.[0].name}</p>
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
      <Description boardDescription={data?.[0].board_info} />
      <div className="team">
        <div className="team__header">
          <img src="/description.svg" alt="team" />
          <p>team</p>
          {data?.[0].users.map(user => {
            const isAdmin = user.role === 'admin'

            return (
              <div className="board-user" key={user.id}>
                <img src={user.img || '/user.svg'} alt="user-image" />
                <p className="name">{user.name}</p>
                {isAdmin && <p>admin</p>}
                {!isAdmin && <button>remove</button>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BoardInfo
