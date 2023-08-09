import { useQuery } from '@tanstack/react-query'
import { getTaskMembers } from '../../utils/apis'
import Loader from '../../ui/Loader'

interface MembersProps {
  taskId: number
}
const Members = function ({ taskId }: MembersProps) {
  const { isLoading, data } = useQuery({
    queryKey: ['get-task-users', taskId],
    queryFn: getTaskMembers(taskId),
  })
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
          data.map((member: { img: string; name: string , id: string}) => (
            <div className="member" key={member.id}>
              <img src={member.img || '/user.svg'} alt="member" />
              <p>{member.name}</p>
            </div>
          ))
        )}
      </div>
      <div className="assign">
        Assign a member
        <span>+</span>
      </div>
    </div>
  )
}

export default Members
