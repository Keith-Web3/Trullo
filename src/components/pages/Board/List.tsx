import { AnimatePresence, motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Task from '../../features/Task/Task'
import '../../../sass/pages/board/list.scss'
import NewCard from '../../ui/NewCard'
import { addTask, deleteList, getListTasks } from '../../utils/apis'
import TaskSkeleton from '../../ui/TaskSkeleton'
import useNotifyOnSuccess from '../../hooks/useNotifyOnSuccess'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  const listOptionsRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  const { isLoading, mutate, isSuccess } = useMutation({
    mutationKey: ['add-task'],
    mutationFn: addTask,
    onSuccess(data) {
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
  }

  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)

    return () => document.removeEventListener('click', handleOuterClick)
  }, [])
  return (
    <div className="list">
      <div className="list__header">
        <span>{name}</span>
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
              <p>Rename</p>
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
      {isFetchingTasks ? (
        <TaskSkeleton />
      ) : (
        data?.map(task => (
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
          />
        ))
      )}
      <AnimatePresence>
        {newTaskIndex === idx && (
          <NewCard
            mutate={mutate}
            isLoading={isLoading}
            id={id}
            type="card"
            setCardDisplay={setNewTaskIndex}
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
