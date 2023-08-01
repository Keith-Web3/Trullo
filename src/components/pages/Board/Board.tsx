import { useParams } from 'react-router-dom'

import BoardHeader from './BoardHeader'
import mockData, { mockDataArr } from '../../data'
import List from './List'
import '../../../sass/pages/board/board.scss'
import { useState } from 'react'
import NewCard from '../../ui/NewCard'

const Board = function () {
  const params = useParams<{ boardId: string }>()
  const [newTaskIndex, setNewTaskIndex] = useState(-1)
  const [isNewListBoxShown, setIsNewListBoxShown] = useState(false)

  const currentBoard = mockData[+params!.boardId!]
  return (
    <div className="board">
      <BoardHeader
        users={currentBoard.users}
        isPrivate={!!currentBoard.isPrivate}
      />
      <div className="board__body">
        {mockDataArr.map((mockData, idx) => (
          <List
            name="backlog"
            newTaskIndex={newTaskIndex}
            tasks={mockData}
            setNewTaskIndex={setNewTaskIndex}
            idx={idx}
            key={idx}
          />
        ))}
        <div className="aside">
          {isNewListBoxShown && <NewCard type="list" />}
          <div
            className="add-list"
            onClick={() => setIsNewListBoxShown(prev => !prev)}
          >
            <span>Add another list</span> <span>+</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board
