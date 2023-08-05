import { ReactNode, useState } from 'react'

import '../../../sass/features/task/actions.scss'
import Labels from './Labels'
import { AnimatePresence } from 'framer-motion'

interface ActionsProps {
  children: ReactNode
  setShowPhotoSearch: React.Dispatch<React.SetStateAction<boolean>>
  taskId: number
  listId: number
}

const Actions = function ({
  children,
  setShowPhotoSearch,
  taskId,
  listId,
}: ActionsProps) {
  const [showLabel, setShowLabel] = useState(false)
  return (
    <div className="actions">
      <div className="actions__header">
        <img src="/user.svg" alt="user" />
        <p>actions</p>
      </div>
      <div className="action">
        <img src="/members.svg" alt="members" />
        <p>members</p>
      </div>
      <div className="action" onClick={() => setShowLabel(true)}>
        <img src="/label.svg" alt="label" />
        <p>labels</p>
        <AnimatePresence>
          {showLabel && (
            <Labels
              setShowLabel={setShowLabel}
              listId={listId}
              taskId={taskId}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="action" onClick={() => setShowPhotoSearch(true)}>
        <img src="/gallery.svg" alt="cover" />
        <p>cover</p>
        {children}
      </div>
    </div>
  )
}

export default Actions
