import { AnimatePresence } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useParams } from 'react-router-dom'

import Task from '../../features/Task/Task'
import '../../../sass/pages/board/list.scss'
import NewCard from '../../ui/NewCard'
import { addTask, getListTasks } from '../../utils/apis'
import Loader from '../../ui/Loader'

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
  const { isLoading, mutate } = useMutation({
    mutationKey: ['add-task'],
    mutationFn: addTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-tasks', id] })
    },
  })
  const { isLoading: isFetchingTasks, data } = useQuery({
    queryKey: ['get-tasks', id],
    queryFn: getListTasks(id),
  })
  return (
    <div className="list">
      <p>
        <span>{name}</span>
        <img src="/ellipsis.svg" alt="ellipsis" />
      </p>
      {isFetchingTasks ? (
        <Loader />
      ) : (
        data?.map(task => (
          <Task key={task.id} taskName={task.task_name} users={task.users} />
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
