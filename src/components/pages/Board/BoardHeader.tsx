import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'

import Button from '../../ui/Button'
import { renderUsers } from '../../utils/renderusers'
import '../../../sass/pages/board/board-header.scss'
import Visibility from '../../ui/Visibility'
import Loader from '../../ui/Loader'
import AddUser from '../../features/AddUser'

interface BoardHeaderProps {
  users: (
    | {
        img: string
        name: string
        id: string
      }
    | {
        img: undefined
        name: string
        id: string
      }
  )[]
  isPrivate: boolean
  boardName: string
  boardId: number
  isFetchingBoard: boolean
}
const BoardHeader = function ({
  users,
  isPrivate,
  boardName,
  boardId,
  isFetchingBoard,
}: BoardHeaderProps) {
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)
  const visibility = useRef<HTMLDivElement>(null)
  const [isAddUserShown, setIsAddUserShown] = useState(false)

  const handleOuterClick = function (e: MouseEvent) {
    if (!visibility.current) return
    if (!visibility.current!.contains(e.target as Node)) {
      setIsVisibilityOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)

    return document.removeEventListener('click', handleOuterClick)
  }, [])

  return (
    <div className="board-header">
      {isFetchingBoard ? (
        <Loader />
      ) : (
        <>
          <Button
            tag
            onClick={() =>
              !visibility.current && setIsVisibilityOpen(prev => !prev)
            }
          >
            <img
              src={`${isPrivate ? '/private' : '/public'}.svg`}
              alt="privacy"
            />
            <span>{isPrivate ? 'Private' : 'Public'}</span>
          </Button>
          <div className="board__users">
            {renderUsers(users)}{' '}
            <div
              className="add-user-btn"
              onClick={() => setIsAddUserShown(true)}
            >
              +
              <AnimatePresence>
                {isAddUserShown && (
                  <AddUser
                    setIsAddUserShown={setIsAddUserShown}
                    boardName={boardName}
                    boardId={boardId}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
      <Button tag>
        <img src="/ellipsis.svg" alt="menu" />
        <span>show menu</span>
      </Button>
      <AnimatePresence>
        {isVisibilityOpen && <Visibility key={nanoid()} ref={visibility} />}
      </AnimatePresence>
    </div>
  )
}

export default BoardHeader
