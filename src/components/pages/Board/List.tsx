import { AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'

import Task, { TaskProps } from './Task'
import '../../../sass/pages/board/list.scss'
import NewCard from '../../ui/NewCard'
import { useMutation } from '@tanstack/react-query'

interface ListProps {
  name: string
  tasks: TaskProps[]
  idx: number
  newTaskIndex: number
  setNewTaskIndex: React.Dispatch<React.SetStateAction<number>>
}

const List = function ({
  name,
  tasks,
  idx,
  newTaskIndex,
  setNewTaskIndex,
}: ListProps) {
  return (
    <div className="list">
      <p>
        <span>{name}</span>
        <img src="/ellipsis.svg" alt="ellipsis" />
      </p>
      {tasks.map((task, idx) => (
        <Task key={idx} {...task} />
      ))}
      <AnimatePresence>
        {newTaskIndex === idx && (
          <NewCard type="card" setNewTaskIndex={setNewTaskIndex} />
        )}
      </AnimatePresence>
      <div className="add-card" onClick={() => setNewTaskIndex(idx)}>
        <span>Add another card</span> <span>+</span>
      </div>
    </div>
  )
}

export default List
