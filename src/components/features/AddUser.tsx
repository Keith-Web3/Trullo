import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import '../../sass/features/add-user.scss'
import { getUsers, sendInvite } from '../utils/apis'
import SuggestedUserSkeleton from '../ui/SuggestedUserSkeleton'
import Loader from '../ui/Loader'
import useNotifyOnSuccess from '../hooks/useNotifyOnSuccess'

interface AddUserProps {
  boardName: string
  boardId: number
  setIsAddUserShown: React.Dispatch<React.SetStateAction<boolean>>
}

const AddUser = function ({
  boardName,
  boardId,
  setIsAddUserShown,
}: AddUserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const addUserRef = useRef<HTMLDivElement>(null)

  const { isLoading, data } = useQuery({
    queryKey: ['get-board-users', searchQuery, boardId],
    queryFn: getUsers(searchQuery, boardId),
  })
  const {
    mutate,
    isLoading: isSendingInvites,
    isSuccess,
  } = useMutation({
    mutationFn: sendInvite,
    onSuccess(data) {
      setNotifications([])
      handleNotify(data)
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)

  const handleSelectUser = function (userId: string) {
    return function () {
      setNotifications(prev => {
        if (prev.includes(userId)) {
          return prev.filter(el => el !== userId)
        }
        return [...prev, userId]
      })
    }
  }
  const handleOuterClick = function (this: Document, ev: MouseEvent) {
    if (!addUserRef.current?.contains(ev.target as Node)) {
      setIsAddUserShown(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)

    return () => document.removeEventListener('click', handleOuterClick)
  }, [])

  return (
    <motion.div
      initial={{ top: -24, opacity: 0 }}
      animate={{ top: '110%', opacity: 1 }}
      exit={{ top: -24, opacity: 0 }}
      ref={addUserRef}
      className="add-user"
    >
      <h1>Invite to Board</h1>
      <p className="subheader">Search users you want to invite</p>
      <label htmlFor="search-users" className="search-box">
        <input
          ref={inputRef}
          onKeyDown={e => {
            if (e.key === 'Enter')
              setSearchQuery((e.target as HTMLInputElement).value)
          }}
          placeholder="User..."
          type="text"
          id="search-users"
        />
        <button onClick={() => setSearchQuery(inputRef.current!.value)}>
          <img src="/search.svg" alt="search" />
        </button>
      </label>
      <div className="suggested-users">
        {isLoading ? (
          <>
            <SuggestedUserSkeleton />
            <SuggestedUserSkeleton />
            <SuggestedUserSkeleton />
          </>
        ) : (
          data?.map(user => (
            <div
              key={user.id}
              className={`suggested-user ${
                notifications.includes(user.user_id) ? 'selected' : ''
              }`}
              onClick={handleSelectUser(user.user_id)}
            >
              <img src={user.img || '/user.svg'} alt="profile-image" />
              <p className="name" title={user.name}>
                {user.name}
              </p>
              <p className="email" title={user.email}>
                {user.email}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="selected-invites"></div>
      <button
        disabled={notifications.length === 0 || isSendingInvites}
        onClick={() =>
          mutate({
            inviteDetails: notifications,
            board_id: boardId,
            board_name: boardName,
          })
        }
      >
        {isSendingInvites && <Loader />}
        invite
      </button>
    </motion.div>
  )
}

export default AddUser
