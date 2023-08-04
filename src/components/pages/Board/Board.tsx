import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'

import BoardHeader from './BoardHeader'
import List from './List'
import '../../../sass/pages/board/board.scss'
import NewCard from '../../ui/NewCard'
import { addList, getBoard, getLists } from '../../utils/apis'
import Loader from '../../ui/Loader'

const Board = function () {
  const params = useParams<{ boardId: string }>()
  const queryClient = useQueryClient()
  const [newTaskIndex, setNewTaskIndex] = useState<number | boolean>(-1)
  const [isNewListBoxShown, setIsNewListBoxShown] = useState(false)
  const [{ isLoading, data }, { isLoading: isFetchingBoard, data: boardData }] =
    useQueries({
      queries: [
        {
          queryKey: ['get-lists', params.boardId],
          queryFn: getLists(+params.boardId!),
        },
        {
          queryKey: ['get-board', params.boardId],
          queryFn: getBoard(+params.boardId!),
        },
      ],
    })
  const { isLoading: isAdding, mutate } = useMutation({
    mutationKey: ['add-list'],
    mutationFn: addList,
    onSuccess: function () {
      setIsNewListBoxShown(false)
      queryClient.invalidateQueries({ queryKey: ['get-lists'] })
    },
  })

  return (
    <div className="board">
      <BoardHeader
        isFetchingBoard={isFetchingBoard}
        boardInfo={boardData?.[0].board_info}
        users={boardData?.[0].users}
        isPrivate={boardData?.[0].isPrivate}
      />
      <div className="board__body">
        {isLoading ? (
          <Loader />
        ) : (
          data?.map((listData, idx) => (
            <List
              name={listData.name}
              newTaskIndex={newTaskIndex}
              setNewTaskIndex={setNewTaskIndex}
              idx={idx}
              id={listData.id}
              key={listData.id}
            />
          ))
        )}
        <div className="aside">
          {isNewListBoxShown && (
            <NewCard
              setCardDisplay={setIsNewListBoxShown}
              isLoading={isAdding}
              mutate={mutate}
              type="list"
            />
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
