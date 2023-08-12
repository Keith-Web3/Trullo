import { motion } from 'framer-motion'

import '../../sass/ui/loader.scss'

interface LoaderProp {
  loaderColor?: string
  ringColor?: string
  width?: string
  ringWidth?: string
}
const Loader = function ({
  loaderColor = '#ffffff',
  ringColor = '#2f80ed',
  width = '24px',
  ringWidth = '3px',
}: LoaderProp) {
  return (
    <motion.div
      animate={{ rotate: ['360deg', '0deg'] }}
      transition={{ duration: 0.6, repeat: Infinity }}
      className="loader"
      style={{
        borderColor: loaderColor,
        borderTopColor: ringColor,
        width,
        borderWidth: ringWidth,
      }}
    ></motion.div>
  )
}

export default Loader
