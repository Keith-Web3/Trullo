import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import '../../sass/ui/message-skeleton.scss'

const MessageSkeleton = function () {
  return (
    <div className="message-skeleton">
      <SkeletonTheme baseColor="#bdbdbd" highlightColor="#f2f2f2">
        <div className="message-skeleton__header">
          <div className="image">
            <Skeleton />
          </div>
          <p className="sender-name">
            <Skeleton />
          </p>
          <p className="time">
            <Skeleton />
          </p>
          <div className="button-container">
            <button>
              <Skeleton />
            </button>
            <div>
              <Skeleton />
            </div>
            <button>
              <Skeleton />
            </button>
          </div>
        </div>
        <p className="message">
          <Skeleton count={2} />
        </p>
      </SkeletonTheme>
    </div>
  )
}

export default MessageSkeleton
