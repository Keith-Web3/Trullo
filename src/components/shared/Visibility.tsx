import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'

import '../../sass/shared/visibility.scss'

interface VisibilityProps {
  setIsPrivate?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((isPrivate: boolean) => void)
}

const visibilityAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const Visibility = function (
  { setIsPrivate }: VisibilityProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <motion.div {...visibilityAnimation} className="visibility" ref={ref}>
      <p className="visibility__header">visibility</p>
      <p className="visibility__subheader">Choose who can see this board.</p>
      <div className="visibility__option" onClick={() => setIsPrivate?.(false)}>
        <p>
          <img src="/public.svg" alt="public" />
          <span>public</span>
        </p>
        <p>Anyone on the internet can see this.</p>
      </div>
      <div className="visibility__option" onClick={() => setIsPrivate?.(true)}>
        <p>
          <img src="/private.svg" alt="private" />
          <span>private</span>
        </p>
        <p>Only board members can see this.</p>
      </div>
    </motion.div>
  )
}

export default forwardRef(Visibility)
