import { useParams } from 'react-router-dom'

import BoardHeader from './BoardHeader'
import mockData from '../../data'

const Board = function () {
  const params = useParams<{ boardId: string }>()

  const currentBoard = mockData[+params!.boardId!]
  return (
    <div className="board">
      <BoardHeader users={currentBoard.users} isPrivate={true} />
    </div>
  )
}

export default Board
