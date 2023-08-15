import { ForwardedRef, forwardRef, useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import '../../sass/shared/notifications.scss'
import formatDate from '../utils/formatDate'
import Notification from './Notification'
import { replyInvitation } from '../utils/apis'

interface NotificationsProps {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>
  notifications: any[] | null | undefined
}

const Notifications = function (
  { notifications, setShowNotifications }: NotificationsProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [notifFilter, setNotifFilter] = useState('unread')
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: replyInvitation,
    onSuccess(_data, { response }) {
      toast.success(`Invitation successfully ${response}`)
      queryClient.invalidateQueries({
        queryKey: ['getBoards'],
      })
      setShowNotifications(false)
    },
    onError(error: any) {
      toast.error(error.message)
    },
  })

  const filteredNotifications = notifications?.filter(
    notif => notif.read_status === notifFilter
  )

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['get-notifications'] })
    }
  }, [])

  return (
    <div className="notifications" ref={ref}>
      <div className="notifications__header">
        <h1>Notifications</h1>
        <img
          onClick={e => {
            e.stopPropagation()
            setShowNotifications(false)
          }}
          src="/close-gray.svg"
          alt="close"
        />
        <div className="tabs">
          <p
            className={notifFilter === 'unread' ? 'active' : ''}
            onClick={() => setNotifFilter('unread')}
          >
            Unread
          </p>
          <p
            className={notifFilter === 'read' ? 'active' : ''}
            onClick={() => setNotifFilter('read')}
          >
            Read
          </p>
        </div>
      </div>
      <div className="notifications__container">
        {filteredNotifications
          ?.sort((a, b) => b.id - a.id)
          .map(notification => {
            const { formattedDate, formattedTime } = formatDate(
              notification.created_at
            )
            return (
              <Notification
                isRead={notification.read_status === 'read'}
                id={notification.id}
                key={notification.id}
                from="invites"
              >
                <img
                  className="notification__img"
                  src={notification.inviter_img || '/user.svg'}
                  alt="inviter"
                />
                <p className="notification__message">
                  Invitation to Collaborate on {notification.board_name} from{' '}
                  <span>{notification.inviter_name}</span>
                </p>
                <div className="notification__time">
                  <p className="time">{formattedTime}</p>
                  <p className="date">{formattedDate}</p>
                </div>
                <div className="notification__actions">
                  <button
                    disabled={isLoading}
                    onClick={() =>
                      mutate({
                        response: 'declined',
                        boardId: notification.board_id,
                        id: notification.id,
                      })
                    }
                  >
                    Decline
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() =>
                      mutate({
                        response: 'accepted',
                        boardId: notification.board_id,
                        id: notification.id,
                      })
                    }
                  >
                    Accept
                  </button>
                </div>
              </Notification>
            )
          })}
      </div>
    </div>
  )
}

export default forwardRef(Notifications)
