import { useState } from 'react'
import { createPortal } from 'react-dom'
import { nanoid } from 'nanoid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DraggableProvided } from 'react-beautiful-dnd'

import { Users, renderUsers } from '../../utils/renderusers'
import '../../../sass/features/task/task.scss'
import TaskInfo from './TaskInfo'
import Img from '../../ui/Img'
import { deleteTag, fetchAttachments, getMessages } from '../../utils/apis'

interface TaskProps {
  image: string
  taskName: string
  tags: { text: string; color: string }[]
  users: Users
  taskId: number
  listName: string
  blurhash: string
  listId: number
  provided: DraggableProvided
  isDragging: boolean
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
  provided,
  isDragging,
}: TaskProps) {
  const [isTaskInfoShown, setIsTaskInfoShown] = useState(false)
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['get-task-messages', taskId],
    queryFn: getMessages(taskId),
  })
  const { data: attachments } = useQuery({
    queryKey: ['get-attachments', taskId],
    queryFn: fetchAttachments(taskId),
  })
  return (
    <div
      className={`task ${isDragging ? 'drag' : ''}`}
      onClick={() => setIsTaskInfoShown(true)}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
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
                title="double tap to remove"
                style={{
                  color: `rgb(${tag.color})`,
                  backgroundColor: `rgba(${tag.color}, 0.25)`,
                }}
                onClick={e => e.stopPropagation()}
                onDoubleClick={async () => {
                  await deleteTag(taskId, tag.text)
                  queryClient.invalidateQueries({ queryKey: ['get-tasks'] })
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
            <span>{data?.data.length || 0}</span>
          </p>
          <p>
            <img src="/attach.svg" alt="attachments" />
            <span>{attachments?.data.length || 0}</span>
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
