import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Button from '../ui/Button'
import '../../sass/features/messages.scss'
import { getMessages, sendMessage } from '../utils/apis'
import useNotifyOnSuccess from '../hooks/useNotifyOnSuccess'
import { formatTimestamp } from '../utils/formatDate'
import MessageSkeleton from '../ui/MessageSkeleton'

interface MessagesProps {
  userImg: string
  taskId: number
}
function Messages({ userImg, taskId }: MessagesProps) {
  const params = useParams()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()

  const { isLoading, data } = useQuery({
    queryKey: ['get-task-messages', taskId],
    queryFn: getMessages(taskId),
  })
  const {
    mutate,
    isSuccess,
    isLoading: isCommenting,
  } = useMutation({
    mutationFn: sendMessage,
    onSuccess(data) {
      handleNotify(data)
      textAreaRef.current!.value = ''
      queryClient.invalidateQueries({
        queryKey: ['get-task-messages', taskId],
      })
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)

  const handleSendMessage = function () {
    if (isCommenting) return
    if (textAreaRef.current?.value.trim() === '') return
    mutate({
      messageData: { task_id: taskId, message: textAreaRef.current!.value },
      notificationData: {
        task_id: taskId,
        board_id: +params.boardId!,
      },
    })
  }

  return (
    <div className="messages">
      <div className="text-box">
        <img src={userImg} alt="user" />
        <textarea
          name="message"
          ref={textAreaRef}
          id="message"
          className="text-input"
          placeholder="Write a comment..."
          onKeyUp={e => {
            ;(e.target as HTMLTextAreaElement).style.height = 'auto'
            const scHeight = (e.target as HTMLTextAreaElement).scrollHeight
            ;(e.target as HTMLTextAreaElement).style.height = `${scHeight}px`
          }}
        ></textarea>
        <Button disabled={isCommenting} onClick={handleSendMessage}>
          Comment
        </Button>
      </div>
      <div className="messages__container">
        {isLoading ? (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        ) : (
          data?.data.map(message => {
            return (
              <div className="task-message" key={message.id}>
                <div className="task-message__header">
                  <img src={message.sender_img || '/user.svg'} alt="sender" />
                  <p className="sender-name">{message.sender_name}</p>
                  <p className="time">{formatTimestamp(message.created_at)}</p>
                  {data.userId === message.sender_id && (
                    <div className="button-container">
                      <button>edit</button>
                      <div></div>
                      <button>delete</button>
                    </div>
                  )}
                </div>
                <p className="message">{message.message}</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Messages
