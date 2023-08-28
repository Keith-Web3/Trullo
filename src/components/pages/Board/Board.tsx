import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import BoardHeader from './BoardHeader'
import List from './List'
import '../../../sass/pages/board/board.scss'
import NewCard from '../../shared/NewCard'
import {
  addList,
  batchUpdateTasks,
  getBoard,
  getLists,
  handleTasksReorder,
  subscribeToCurrentBoard,
} from '../../utils/apis'
import Loader from '../../ui/Loader'
import useNotifyOnSuccess from '../../hooks/useNotifyOnSuccess'
import BoardInfo from './BoardInfo'

const Board = function () {
  const params = useParams<{ boardId: string }>()
  const queryClient = useQueryClient()
  const [showBoardInfo, setShowBoardInfo] = useState(false)
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
  const { mutate: batchUpdate } = useMutation({
    mutationFn: batchUpdateTasks,
    onMutate: async function ({ reordered, destination_id, source_id }) {
      if (destination_id === source_id) {
        await queryClient.cancelQueries({
          queryKey: ['get-tasks', +destination_id],
        })

        const previousTasks = queryClient.getQueryData([
          'get-tasks',
          +destination_id,
        ])
        queryClient.setQueryData(['get-tasks', +source_id], () => reordered)
        return [{ previousTasks, id: +source_id }]
      } else {
        await queryClient.cancelQueries({
          queryKey: ['get-tasks', +destination_id],
        })
        await queryClient.cancelQueries({ queryKey: ['get-tasks', +source_id] })

        const previousDestinationTasks = queryClient.getQueryData([
          'get-tasks',
          +destination_id,
        ])
        const previousSourceTasks = queryClient.getQueryData([
          'get-tasks',
          +source_id,
        ])
        queryClient.setQueryData(['get-tasks', +source_id], () => reordered[1])
        queryClient.setQueryData(
          ['get-tasks', +destination_id],
          () => reordered[0]
        )
        return [
          { previousTasks: previousDestinationTasks, id: +destination_id },
          { previousTasks: previousSourceTasks, id: +source_id },
        ]
      }
    },
    onError(_error, _variables, context) {
      context?.map(el => {
        queryClient.setQueryData(['get-tasks', el.id], () => el.previousTasks)
      })
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['get-tasks'] })
    },
  })
  const {
    isLoading: isAdding,
    mutate,
    isSuccess,
  } = useMutation({
    mutationKey: ['add-list'],
    mutationFn: addList,
    onSuccess: function (data) {
      setIsNewListBoxShown(false)
      handleNotify(data!)
      queryClient.invalidateQueries({ queryKey: ['get-lists'] })
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)

  useEffect(() => {
    const unsubscribe = subscribeToCurrentBoard({
      boardId: +params.boardId!,
      queryClient,
    })

    return unsubscribe
  }, [])

  const handleDragDrop = function (results: DropResult) {
    if (results.destination == undefined) return
    if (
      results.destination.droppableId === results.source.droppableId &&
      results.destination.index === results.source.index
    )
      return
    batchUpdate({
      ...handleTasksReorder(
        results.destination,
        results.source,
        queryClient,
        +results.draggableId
      )!,
      destination_id: results.destination.droppableId,
      source_id: results.source.droppableId,
    })
  }

  return boardData?.data?.length === 0 ? (
    <Navigate to="/*" />
  ) : (
    <div className="board">
      <BoardHeader
        isFetchingBoard={isFetchingBoard}
        boardName={boardData?.data?.[0].name}
        boardId={boardData?.data?.[0].id}
        users={boardData?.data?.[0].users}
        isPrivate={boardData?.data?.[0].isPrivate}
        setShowBoardInfo={setShowBoardInfo}
      />
      <AnimatePresence>
        {showBoardInfo && <BoardInfo setShowBoardInfo={setShowBoardInfo} />}
      </AnimatePresence>
      <div className="board__body">
        <DragDropContext onDragEnd={handleDragDrop}>
          {isLoading ? (
            <Loader />
          ) : (
            data
              ?.sort((a, b) => a.id - b.id)
              .map((listData, idx) => (
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
        </DragDropContext>
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
