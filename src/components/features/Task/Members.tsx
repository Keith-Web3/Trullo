import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getTaskMembers } from '../../utils/apis'
import Loader from '../../ui/Loader'
import AddTaskUser from '../AddTaskUser'

interface MembersProps {
  taskId: number
}
const Members = function ({ taskId }: MembersProps) {
  const { isLoading, data } = useQuery({
    queryKey: ['get-task-users', taskId],
    queryFn: getTaskMembers(taskId),
  })
  const [isAddMemberShown, setIsAddMemberShown] = useState(false)
  const params = useParams<{ boardId: string }>()
  return (
    <div className="action members">
      <div className="action__header">
        <img src="/members.svg" alt="members" />
        <p>members</p>
      </div>
      <div className="members-container">
        {isLoading ? (
          <Loader />
        ) : (
          data.map((member: { img: string; name: string; id: string }) => (
            <div className="member" key={member.id}>
              <img src={member.img || '/user.svg'} alt="member" />
              <p>{member.name}</p>
            </div>
          ))
        )}
      </div>
      <div className="assign" onClick={() => setIsAddMemberShown(true)}>
        Assign a member
        <span>+</span>
        {isAddMemberShown && (
          <AddTaskUser
            setIsAddUserShown={setIsAddMemberShown}
            boardId={+params.boardId!}
            taskId={taskId}
          />
        )}
      </div>
    </div>
  )
}

export default Members
