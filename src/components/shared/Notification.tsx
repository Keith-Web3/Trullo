import { useMutation } from '@tanstack/react-query'
import { ReactNode, useRef, useEffect } from 'react'

import { supabase } from '../services/supabase'

interface NotificationProps {
  children: ReactNode
  id: number
  isRead: boolean
  from: string
}
const Notification = function ({
  children,
  id,
  isRead,
  from,
}: NotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null)
  const { mutate } = useMutation({
    mutationFn: async function () {
      await supabase
        .from(from)
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

export default Notification
