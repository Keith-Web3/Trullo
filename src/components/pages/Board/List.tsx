import Task, { TaskProps } from './Task'
import '../../../sass/pages/board/list.scss'

interface ListProps {
  name: string
  tasks: TaskProps[]
}

const List = function ({ name, tasks }: ListProps) {
  return (
    <div className="list">
      <p>
        <span>{name}</span>
        <img src="/ellipsis.svg" alt="ellipsis" />
      </p>
      {tasks.map((task, idx) => (
        <Task key={idx} {...task} />
      ))}
      <div className="add-card">
        <span>Add another card</span> <span>+</span>
      </div>
    </div>
  )
}

export default List
