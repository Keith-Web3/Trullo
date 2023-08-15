import { useState } from 'react'
import { createPortal } from 'react-dom'
import { nanoid } from 'nanoid'

import { Users, renderUsers } from '../../utils/renderusers'
import '../../../sass/features/task/task.scss'
import TaskInfo from './TaskInfo'
import Img from '../../ui/Img'

interface TaskProps {
  image: string
  taskName: string
  tags: { text: string; color: string }[]
  users: Users
  taskId: number
  listName: string
  blurhash: string
  listId: number
}

const Task = function ({
  image,
  taskName,
  tags,
  users,
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
        {tags
          ?.sort((a, b) => b.text.length - a.text.length)
          .map(tag => {
            return (
              <p
                key={nanoid()}
                className="tag"
                style={{
                  color: `rgb(${tag.color})`,
                  backgroundColor: `rgba(${tag.color}, 0.25)`,
                }}
              >
                {tag.text}
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
            <span>{0}</span>
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
