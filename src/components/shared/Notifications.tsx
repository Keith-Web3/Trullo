import { useState } from 'react'

import '../../sass/shared/notifications.scss'
import formatDate from '../utils/formatDate'

interface NotificationsProps {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>
  notifications: any[] | null | undefined
}

const Notifications = function ({
  notifications,
  setShowNotifications,
}: NotificationsProps) {
  const [notifFilter, setNotifFilter] = useState('unread')

  const filteredNotifications = notifications?.filter(
    notif => notif.read_status === notifFilter
  )

  return (
    <div className="notifications">
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
        {filteredNotifications?.map(notification => {
          const { formattedDate, formattedTime } = formatDate(
            notification.created_at
          )
          return (
            <div className="notification" key={notification.id}>
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
                <button>Decline</button>
                <button>Accept</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notifications
