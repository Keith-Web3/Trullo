import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { AnimatePresence, motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Task from '../../features/Task/Task'
import '../../../sass/pages/board/list.scss'
import NewCard from '../../shared/NewCard'
import {
  addTask,
  deleteList,
  getListTasks,
  updateListName,
} from '../../utils/apis'
import TaskSkeleton from '../../ui/TaskSkeleton'
import useNotifyOnSuccess from '../../hooks/useNotifyOnSuccess'

interface ListProps {
  name: string
  idx: number
  id: number
  newTaskIndex: number | boolean
  setNewTaskIndex: React.Dispatch<React.SetStateAction<number | boolean>>
}

const List = function ({
  name,
  idx,
  id,
  newTaskIndex,
  setNewTaskIndex,
}: ListProps) {
  const queryClient = useQueryClient()
  const [showListOptions, setShowListOptions] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const listOptionsRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const params = useParams()

  const { isLoading, mutate, isSuccess } = useMutation({
    mutationKey: ['add-task'],
    mutationFn: addTask,
    onSuccess(data) {
      setNewTaskIndex(-1)
      handleNotify(data!)
      queryClient.invalidateQueries({ queryKey: ['get-tasks', id] })
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)
  const { mutate: handleDeleteList, isSuccess: isListDeleteSuccess } =
    useMutation({
      mutationFn: deleteList,
      onSuccess(data) {
        handleListNotify(data)
        queryClient.invalidateQueries({ queryKey: ['get-lists'] })
      },
    })
  const handleListNotify = useNotifyOnSuccess(isListDeleteSuccess)
  const { isLoading: isFetchingTasks, data } = useQuery({
    queryKey: ['get-tasks', id],
    queryFn: getListTasks(id),
  })

  const handleOuterClick: (this: Document, ev: MouseEvent) => any = function (
    e
  ) {
    if (!listOptionsRef.current?.contains(e.target as Node))
      setShowListOptions(false)
    if (!inputRef.current?.contains(e.target as Node)) setIsEditingName(false)
  }

  useEffect(() => {
    if (isEditingName === true) inputRef.current?.focus()
  }, [isEditingName])

  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)

    return () => {
      document.removeEventListener('click', handleOuterClick)
    }
  }, [])
  return (
    <div className="list">
      <div className="list__header">
        {isEditingName ? (
          <input
            ref={inputRef}
            defaultValue={name}
            onKeyDown={async e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                await updateListName({
                  name: (e.target as HTMLInputElement).value,
                  listId: id,
                  prevName: name,
                  boardId: +params.boardId!,
                })
                queryClient.invalidateQueries({ queryKey: ['get-lists'] })
                setIsEditingName(false)
              }
            }}
          />
        ) : (
          <span>{name}</span>
        )}
        <img
          onClick={() => setShowListOptions(true)}
          src="/ellipsis.svg"
          alt="ellipsis"
        />
        <AnimatePresence>
          {showListOptions && (
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: '100%', opacity: 1 }}
              exit={{ top: 0, opacity: 0 }}
              ref={listOptionsRef}
              className="list-options"
            >
              <p
                onClick={() => {
                  setIsEditingName(true)
                  setShowListOptions(false)
                }}
              >
                Rename
              </p>
              <p
                onClick={() =>
                  handleDeleteList({
                    listId: id,
                    listName: name,
                    boardId: +params.boardId!,
                  })
                }
              >
                Delete this list
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Droppable droppableId={`${id}`} type="group">
        {provided => {
          return (
            <div
              className="list__body"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {isFetchingTasks ? (
                <TaskSkeleton />
              ) : (
                data
                  ?.filter(el =>
                    el.task_name
                      .toLowerCase()
                      .includes(searchParams.get('filter') || '')
                  )
                  .sort((a, b) => a.order - b.order)
                  .map(task => (
                    <Draggable
                      draggableId={`${task.id}`}
                      key={task.id}
                      index={task.order}
                    >
                      {(provided, snapshot) => (
                        <Task
                          listName={name}
                          tags={task.tags}
                          listId={id}
                          key={task.id}
                          taskId={task.id}
                          taskName={task.task_name}
                          users={task.users}
                          image={task.image}
                          blurhash={task.image_blurhash}
                          provided={provided}
                          isDragging={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))
              )}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
      <AnimatePresence>
        {newTaskIndex === idx && (
          <NewCard
            mutate={mutate}
            isLoading={isLoading}
            id={id}
            type="card"
            setCardDisplay={setNewTaskIndex}
            tasksLength={data?.length}
          />
        )}
      </AnimatePresence>
      <div className="add-card" onClick={() => setNewTaskIndex(idx)}>
        <span>Add another card</span> <span>+</span>
      </div>
    </div>
  )
}

export default List
