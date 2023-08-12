import { ReactNode, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import '../../sass/shared/notifications.scss'
import formatDate from '../utils/formatDate'
import { supabase } from '../data/supabase'
import { replyInvitation } from '../utils/apis'

interface NotificationsProps {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>
  notifications: any[] | null | undefined
}
interface NotificationProps {
  children: ReactNode
  id: number
  isRead: boolean
}

const Notifications = function ({
  notifications,
  setShowNotifications,
}: NotificationsProps) {
  const [notifFilter, setNotifFilter] = useState('unread')
  const notificationRef = useRef<HTMLDivElement>(null)
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
  function handleOuterClick(this: Document, e: MouseEvent) {
    if (
      notificationRef.current &&
      !notificationRef.current?.contains(e.target as Node)
    )
      setShowNotifications(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)

    return () => {
      document.removeEventListener('click', handleOuterClick)
      queryClient.invalidateQueries({ queryKey: ['get-notifications'] })
    }
  }, [])

  return (
    <div className="notifications" ref={notificationRef}>
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
          ?.sort((a, b) => a.id - b.id)
          .map(notification => {
            const { formattedDate, formattedTime } = formatDate(
              notification.created_at
            )
            return (
              <Notification
                isRead={notification.read_status === 'read'}
                id={notification.id}
                key={notification.id}
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

const Notification = function ({ children, id, isRead }: NotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null)
  const { mutate } = useMutation({
    mutationFn: async function () {
      await supabase
        .from('invites')
        .update({ read_status: 'read' })
        .eq('id', id)
        .select()
    },
  })
  useEffect(() => {
    if (isRead) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target)
          mutate()
        }
      })
    })
    if (notificationRef.current) {
      observer.observe(notificationRef.current)
    }

    return () => {
      if (notificationRef.current) {
        observer.unobserve(notificationRef.current)
      }
    }
  }, [])
  return (
    <div className="notification" ref={notificationRef}>
      {children}
    </div>
  )
}

export default Notifications
