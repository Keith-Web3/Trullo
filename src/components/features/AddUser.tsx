import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import '../../sass/features/add-user.scss'
import { getUsers } from '../utils/apis'
import SuggestedUserSkeleton from '../ui/SuggestedUserSkeleton'

interface AddUserProps {
  type: 'board' | 'task'
}

const AddUser = function ({ type }: AddUserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoading, data } = useQuery({
    queryKey: ['get-board-users', searchQuery],
    queryFn: getUsers(searchQuery),
  })

  return (
    <motion.div
      initial={{ top: -24, opacity: 0 }}
      animate={{ top: 0, opacity: 1 }}
      exit={{ top: -24, opacity: 0 }}
      className="add-user"
    >
      {type === 'board' ? (
        <>
          <h1>Invite to Board</h1>
          <p className="subheader">Search users you want to invite</p>
        </>
      ) : (
        <>
          <h1>Members</h1>
          <p className="subheader">Assign members to this card</p>
        </>
      )}
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
          data?.map(
            (user: {
              name: string
              email: string
              user_id: string
              img: string | null
              id: number
            }) => (
              <div key={user.id} className="suggested-user">
                <img src={user.img || '/user.svg'} alt="profile-image" />
                <p className="name" title={user.name}>
                  {user.name}
                </p>
                <p className="email" title={user.email}>
                  {user.email}
                </p>
              </div>
            )
          )
        )}
      </div>
      <div className="selected-invites"></div>
      <button>invite</button>
    </motion.div>
  )
}

export default AddUser
