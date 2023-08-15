import { ForwardedRef, forwardRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import '../../sass/shared/board-notifications.scss'
import Notification from './Notification'
import formatDate from '../utils/formatDate'

interface BoardNotificationsProps {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>
  notifications: any[] | null | undefined
}

const BoardNotifications = function (
  { notifications, setShowNotifications }: BoardNotificationsProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['get-notifications'] })
    }
  }, [])
  return (
    <div className="board-notifications" ref={ref}>
      <header className="board-notifications__header">
        <h1>Notifications</h1>
        <img
          onClick={e => {
            e.stopPropagation()
            setShowNotifications(false)
          }}
          src="/close-gray.svg"
          alt="close-btn"
        />
      </header>
      {notifications
        ?.sort((a, b) => b.id - a.id)
        .map(notif => {
          const { formattedDate, formattedTime } = formatDate(notif.created_at)
          return (
            <Notification
              key={notif.id}
              id={notif.id}
              isRead={notif.read_status == 'read'}
              from="board_notifications"
            >
              <img
                className="sender_img"
                src={notif.sender_img || '/user.svg'}
              />
              <p className="board-notification__message">
                <span>{notif.sender_name}</span> {notif.message}
              </p>
              <div
                className={notif.read_status === 'read' ? 'dot' : 'dot active'}
              ></div>
              <div className="notification__time">
                <p className="time">{formattedTime}</p>
                <p className="date">{formattedDate}</p>
              </div>
            </Notification>
          )
        })}
    </div>
  )
}

export default forwardRef(BoardNotifications)
