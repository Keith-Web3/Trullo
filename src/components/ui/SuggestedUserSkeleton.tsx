import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import '../../sass/ui/suggested-user-skeleton.scss'

const SuggestedUserSkeleton = function () {
  return (
    <div className="suggested-user-skeleton">
      <SkeletonTheme baseColor="#bdbdbd" highlightColor="#f2f2f2">
        <div className="image">
          <Skeleton />
        </div>
        <div className="name">
          <Skeleton />
        </div>
        <div className="email">
          <Skeleton />
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default SuggestedUserSkeleton
