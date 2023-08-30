import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import '../../sass/features/add-user.scss'
import { assignUsersToBoard, getTaskUsers } from '../utils/apis'
import SuggestedUserSkeleton from '../ui/SuggestedUserSkeleton'
import useNotifyOnSuccess from '../hooks/useNotifyOnSuccess'
import Loader from '../ui/Loader'

interface AddUserProps {
  boardId: number
  taskId: number
  setIsAddUserShown: React.Dispatch<React.SetStateAction<boolean>>
}

const AddUser = function ({
  boardId,
  taskId,
  setIsAddUserShown,
}: AddUserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addUserRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { isLoading, data } = useQuery({
    queryKey: ['get-task-users', taskId, searchQuery, boardId],
    queryFn: getTaskUsers(searchQuery, boardId, taskId),
  })
  const {
    isLoading: isAssigning,
    mutate,
    isSuccess,
  } = useMutation({
    mutationFn: assignUsersToBoard,
    onSuccess(data) {
      handleNotify(data)
      toast.success('Assigned users to task')
      queryClient.invalidateQueries({
        queryKey: ['get-task-users', taskId],
      })
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)
  const [notifications, setNotifications] = useState<string[]>([])

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
      <h1>Members</h1>
      <p className="subheader">Assign members to this card</p>
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
              className={`suggested-user suggested-user--task ${
                notifications.includes(user.id) ? 'selected' : ''
              }`}
              onClick={handleSelectUser(user.id)}
            >
              <img src={user.img || '/user.svg'} alt="profile-image" />
              <p className="name" title={user.name}>
                {user.name}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="selected-invites"></div>
      <button
        disabled={isAssigning || notifications.length === 0}
        onClick={() => {
          const users = data!
            .map(user => {
              if (notifications.includes(user.id))
                return { ...user, role: 'assignee' }
              return null
            })
            .filter(user => user !== null) as {
            role: 'assignee'
            id: string
            name: string
            img?: string | undefined
          }[]
          mutate({ taskId, users, boardId })
        }}
      >
        {isAssigning && <Loader />} add users
      </button>
    </motion.div>
  )
}

export default AddUser
