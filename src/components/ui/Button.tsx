import { ReactNode } from 'react'
import { motion } from 'framer-motion'

import '../../sass/ui/button.scss'

interface ButtonProps {
  children: ReactNode
  tag?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}
const Button = function ({
  children,
  tag = false,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={tag ? undefined : { scale: 1.05 }}
      whileTap={tag ? undefined : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`button ${tag ? 'tag' : ''}`}
    >
      {children}
    </motion.button>
  )
}

export default Button
