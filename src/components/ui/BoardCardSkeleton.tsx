import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import '../../sass/ui/board-card-skeleton.scss'

const BoardCardSkeleton = function () {
  return (
    <div className="board-card-skeleton">
      <SkeletonTheme baseColor="#bdbdbd" highlightColor="#f2f2f2">
        <div className="image">
          <Skeleton />
        </div>
        <div className="name">
          <Skeleton />
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
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default BoardCardSkeleton
