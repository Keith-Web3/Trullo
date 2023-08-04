import { ReactNode } from 'react'

import '../../../sass/features/task/actions.scss'
import PhotoSearch from '../PhotoSearch'

interface ActionsProps {
  children: ReactNode
}

const Actions = function ({ children }: ActionsProps) {
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
      <div className="action">
        <img src="/label.svg" alt="label" />
        <p>labels</p>
      </div>
      <div className="action">
        <img src="/gallery.svg" alt="cover" />
        <p>cover</p>
        {children}
      </div>
    </div>
  )
}

export default Actions
