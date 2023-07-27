import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'

import '../../sass/ui/visibility.scss'

const visibilityAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const Visiblity = function ({}, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <motion.div {...visibilityAnimation} className="visibility" ref={ref}>
      <p className="visibility__header">visibility</p>
      <p className="visibility__subheader">Choose who can see this board.</p>
      <div className="visibility__option">
        <p>
          <img src="/public.svg" alt="public" />
          <span>public</span>
        </p>
        <p>Anyone on the internet can see this.</p>
      </div>
      <div className="visibility__option">
        <p>
          <img src="/private.svg" alt="private" />
          <span>private</span>
        </p>
        <p>Only board members can see this.</p>
      </div>
    </motion.div>
  )
}

export default forwardRef(Visiblity)
