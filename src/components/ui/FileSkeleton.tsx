import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import '../../sass/ui/file-skeleton.scss'

const FileSkeleton = function () {
  return (
    <div className="file-skeleton">
      <SkeletonTheme baseColor="#bdbdbd" highlightColor="#f2f2f2">
        <div className="file-preview">
          <Skeleton />
        </div>
        <div className="date">
          <Skeleton />
        </div>
        <div className="name">
          <Skeleton />
        </div>
        <div className="button-container">
          <div>
            <Skeleton />
          </div>
          <div>
            <Skeleton />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default FileSkeleton
