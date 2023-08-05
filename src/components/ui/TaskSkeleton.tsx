import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import '../../sass/ui/task-skeleton.scss'

const TaskSkeleton = function () {
  return (
    <div className="task-skeleton">
      <SkeletonTheme baseColor="#bdbdbd" highlightColor="#f2f2f2">
        <div className="image">
          <Skeleton />
        </div>
        <div className="title">
          <Skeleton />
        </div>
        <div className="skeleton-labels">
          <div className="label">
            <Skeleton />
          </div>
          <div className="label">
            <Skeleton />
          </div>
        </div>
        <div className="users">
          <div className="user">
            <Skeleton />
          </div>
          <div className="user">
            <Skeleton />
          </div>
          <div className="user">
            <Skeleton />
          </div>
          <div className="user user--special">
            <Skeleton />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default TaskSkeleton
