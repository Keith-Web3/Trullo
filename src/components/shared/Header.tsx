import { Suspense, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Await, Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Button from '../ui/Button'
import '../../sass/shared/header.scss'
import Loader from '../ui/Loader'
import { supabase } from '../data/supabase'
import { getBoardNotifications, getNotifications } from '../utils/apis'
import Notifications from './Notifications'
import BoardNotifications from './BoardNotifications'

type ResolvedData = {
  name: string
  img: string | undefined
  id: string
}

const loaderRenderProp = function (resolvedData: ResolvedData) {
  return (
    <>
      <img
        className="user__image"
        src={resolvedData.img || '/user.svg'}
        alt="user"
      />
      <p className="user__name" title={resolvedData.name}>
        {resolvedData.name}
      </p>
    </>
  )
}
const Header = function ({ userDetails }: { userDetails: unknown }) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  const isBoardOpen = params.boardId !== undefined

  const { isLoading, data } = useQuery({
    queryKey: ['get-board-name', params.boardId],
    queryFn: async function () {
      const { data, error } = await supabase
        .from('Boards')
        .select('name')
        .eq('id', params.boardId)
      if (error) toast.error(error.message)
      return data
    },
    enabled: isBoardOpen,
  })
  const { data: notifications } = useQuery({
    queryKey: ['get-notifications', params?.boardId!],
    queryFn: isBoardOpen
      ? getBoardNotifications(+params.boardId!)
      : getNotifications,
  })
  const areNotificationsUnread = notifications?.some(
    notifs => notifs.read_status === 'unread'
  )
  const notificationVariants = {
    animate: {
      rotate: ['0deg', '10deg', '-10deg', '10deg', '-10deg', '0deg'],
      transition: { duration: 0.6, repeat: 8, repeatDelay: 1 },
    },
    final: {
      rotate: ['0deg', '0deg'],
      transition: {
        repeat: 0,
      },
    },
  }
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
    }
  }, [])

  return (
    <header className="header">
      <img className="header__logo" src="/Logo.svg" alt="logo" />
      {params.boardId !== undefined && (
        <div className="boards__info">
          {isLoading ? <Loader /> : data?.[0]?.name}
          <div></div>
          <Link to="/">
            <Button tag>
              <img src="/grid.svg" alt="apps" />
              <span>All boards</span>
            </Button>
          </Link>
        </div>
      )}
      <motion.div
        variants={notificationVariants}
        animate={
          areNotificationsUnread && !showNotifications ? 'animate' : 'final'
        }
        className={`header__notifications ${
          areNotificationsUnread ? 'unread' : ''
        }`}
        onClick={() => setShowNotifications(true)}
      >
        <img className="bell" src="/bell.svg" alt="notifications" />
        {showNotifications &&
          (isBoardOpen ? (
            <BoardNotifications
              ref={notificationRef}
              setShowNotifications={setShowNotifications}
              notifications={notifications}
            />
          ) : (
            <Notifications
              ref={notificationRef}
              setShowNotifications={setShowNotifications}
              notifications={notifications}
            />
          ))}
      </motion.div>
      <label className="header__label" htmlFor="search">
        <input placeholder="Keyword..." type="text" id="search" />
        <Button>search</Button>
      </label>
      <div className="user">
        <Suspense fallback={<Loader />}>
          <Await resolve={userDetails}>{loaderRenderProp}</Await>
        </Suspense>
        <motion.img
          animate={{ rotate: isDropDownOpen ? '180deg' : '0deg' }}
          onClick={() => setIsDropDownOpen(prev => !prev)}
          className="user__caret"
          src="/caret-down-solid.svg"
          alt="drop down"
        />
      </div>
    </header>
  )
}

export default Header
