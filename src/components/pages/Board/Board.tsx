import { useParams } from 'react-router-dom'

import BoardHeader from './BoardHeader'
import mockData, { mockDataArr } from '../../data'
import List from './List'
import '../../../sass/pages/board/board.scss'

const Board = function () {
  const params = useParams<{ boardId: string }>()

  const currentBoard = mockData[+params!.boardId!]
  return (
    <div className="board">
      <BoardHeader
        users={currentBoard.users}
        isPrivate={!!currentBoard.isPrivate}
      />
      <div className="board__body">
        {mockDataArr.map((mockData, idx) => (
          <List name="backlog" tasks={mockData} key={idx} />
        ))}
        <div className="add-list">
          <span>Add another list</span> <span>+</span>
        </div>
      </div>
    </div>
  )
}

export default Board
