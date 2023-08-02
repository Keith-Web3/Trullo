import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import BoardHeader from './BoardHeader'
import mockData, { mockDataArr } from '../../data'
import List from './List'
import '../../../sass/pages/board/board.scss'
import NewCard from '../../ui/NewCard'
import { addList } from '../../utils/apis'

const Board = function () {
  const params = useParams<{ boardId: string }>()
  const [newTaskIndex, setNewTaskIndex] = useState(-1)
  const [isNewListBoxShown, setIsNewListBoxShown] = useState(false)
  const { isLoading, data, mutate } = useMutation({
    mutationKey: ['add-list'],
    mutationFn: addList,
    //TODO add onsuccess function to invalidate lists fetch query
  })

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
          {isNewListBoxShown && (
            <NewCard isLoading={isLoading} mutate={mutate} type="list" />
          )}
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
