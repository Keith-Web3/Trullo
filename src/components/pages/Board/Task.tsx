import { renderUsers } from '../../utils/renderusers'
import '../../../sass/pages/board/task.scss'
import { getRandomColor } from '../../utils/getRandomColor'

type User = {
  id: number
  image: string
  name: string
}

interface TaskProps {
  image: string
  taskName: string
  tags: string[]
  users: User[]
  messages: {
    user: User
    timestamp: string
    message: string
  }[]
}

const Task = function ({ image, taskName, tags, users, messages }: TaskProps) {
  return (
    <div className="task">
      {!!image && <img className="task__image" src={image} alt={taskName} />}
      <p className="task__title">{taskName}</p>
      <div className="tags">
        {tags.map((tag, idx) => {
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
            <span>{messages.length}</span>
          </p>
          <p>
            <img src="/attach.svg" alt="attachments" />
            <span>3</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export type { TaskProps }
export default Task
