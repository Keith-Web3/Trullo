import { useState } from 'react'
import { createPortal } from 'react-dom'

import { Users, renderUsers } from '../../utils/renderusers'
import '../../../sass/features/task/task.scss'
import { getRandomColor } from '../../utils/getRandomColor'
import TaskInfo from './TaskInfo'
import Img from '../../ui/Img'

type User = {
  id: number
  img: string
  name: string
}

interface TaskProps {
  image: string
  taskName: string
  tags: string[]
  users: Users
  taskId: number
  listName: string
  blurhash: string
  listId: number
  messages: {
    user: User
    timestamp: string
    message: string
  }[]
}

const Task = function ({
  image,
  taskName,
  tags,
  users,
  messages,
  taskId,
  listName,
  blurhash,
  listId,
}: TaskProps) {
  const [isTaskInfoShown, setIsTaskInfoShown] = useState(false)
  return (
    <div className="task" onClick={() => setIsTaskInfoShown(true)}>
      {!!image && (
        <Img
          className="task__image"
          blurhash={blurhash}
          src={image}
          alt={taskName}
        />
      )}
      <p className="task__title">{taskName}</p>
      <div className="tags">
        {tags?.map((tag, idx) => {
          const color = getRandomColor()
          return (
            <p
              key={idx}
              className="tag"
              style={{
                color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.15)`,
              }}
            >
              {tag}
            </p>
          )
        })}
      </div>
      <div className="footer">
        <div className="task__users">
          {renderUsers(users.slice(0, 3))} <div>+</div>
        </div>
        <div className="task__info">
          <p>
            <img src="/comment.svg" alt="comment" />
            <span>{messages?.length || 0}</span>
          </p>
          <p>
            <img src="/attach.svg" alt="attachments" />
            <span>3</span>
          </p>
        </div>
      </div>
      {isTaskInfoShown &&
        createPortal(
          <TaskInfo
            setIsTaskInfoShown={setIsTaskInfoShown}
            taskName={taskName}
            listName={listName}
            taskId={taskId}
            coverImg={image}
            coverBlurHash={blurhash}
            listId={listId}
          />,
          document.getElementById('modal-root')!
        )}
    </div>
  )
}

export default Task
