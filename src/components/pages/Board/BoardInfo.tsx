import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import formatDate from '../../utils/formatDate'
import '../../../sass/pages/board/board-info.scss'
import { getBoard, removeUserFromBoard } from '../../utils/apis'
import Loader from '../../ui/Loader'
import Description from '../../features/Task/Description'
import { motion } from 'framer-motion'

const BoardInfo = function ({
  setShowBoardInfo,
}: {
  setShowBoardInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const params = useParams()
  const queryClient = useQueryClient()
  const { isLoading, data } = useQuery({
    queryKey: ['get-board', params.boardId],
    queryFn: getBoard(+params.boardId!),
  })
  const { mutate } = useMutation({
    mutationFn: removeUserFromBoard,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['get-task-description', +params.boardId!],
      })
    },
  })
  const author = data?.data?.[0].users?.find(
    (user: { role: string }) => user.role === 'admin'
  )
  const { formattedDate } = formatDate(data?.data?.[0].created_at)

  return isLoading ? (
    <Loader />
  ) : (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="board-info"
    >
      <div className="board-info__header">
        <p>{data?.data?.[0].name}</p>
        <img
          src="/close-gray.svg"
          alt="close"
          onClick={() => setShowBoardInfo(false)}
        />
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
      <Description boardDescription={data?.data?.[0].board_info} />
      <div className="team">
        <div className="team__header">
          <img src="/description.svg" alt="team" />
          <p>team</p>
        </div>
        {data?.data?.[0].users.map((user: any) => {
          const isAdmin = user.role === 'admin'

          return (
            <div className="board-user" key={user.id}>
              <img src={user.img || '/user.svg'} alt="user-image" />
              <p className="name">{user.name}</p>
              {isAdmin && <p className="admin">admin</p>}
              {data.userId === author.id && !isAdmin && (
                <button
                  onClick={() => {
                    mutate({ boardId: +params.boardId!, userId: user.id })
                  }}
                >
                  remove
                </button>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default BoardInfo
