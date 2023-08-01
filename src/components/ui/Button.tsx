import { ReactNode } from 'react'

import '../../sass/ui/button.scss'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  tag?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}
const Button = function ({ children, tag = false, onClick }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`button ${tag ? 'tag' : ''}`}
    >
      {children}
    </motion.button>
  )
}

export default Button
