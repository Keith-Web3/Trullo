import { ReactNode } from 'react'

import '../../sass/ui/button.scss'

interface ButtonProps {
  children: ReactNode
  tag?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}
const Button = function ({ children, tag = false, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={`button ${tag ? 'tag' : ''}`}>
      {children}
    </button>
  )
}

export default Button
