import { useParams } from 'react-router-dom'

import BoardHeader from './BoardHeader'
import mockData, { mockData1 } from '../../data'
import Task from './Task'

const Board = function () {
  const params = useParams<{ boardId: string }>()

  const currentBoard = mockData[+params!.boardId!]
  return (
    <div className="board">
      <BoardHeader
        users={currentBoard.users}
        isPrivate={!!currentBoard.isPrivate}
      />
      <Task {...mockData1[0]} />
    </div>
  )
}

export default Board
