import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import '../../sass/ui/new-card.scss'

interface NewCardProps {
  setNewTaskIndex?: React.Dispatch<React.SetStateAction<number>>
  type: string
}

const NewCard = function ({ setNewTaskIndex, type }: NewCardProps) {
  const newCardRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOuterClick = function (e: MouseEvent) {
    if (newCardRef.current && !newCardRef.current!.contains(e.target as Node)) {
      setNewTaskIndex?.(-1)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOuterClick, true)
    textAreaRef.current?.focus()

    return () => document.removeEventListener('click', handleOuterClick)
  }, [])

  return (
    <motion.div
      ref={newCardRef}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{
        scaleY: 1,
        opacity: 1,
        rotate: ['5deg', '-5deg', '5deg', '-5deg', '0deg'],
      }}
      exit={{ scaleY: 0, opacity: 0 }}
      className="new-card"
    >
      <textarea
        name="new-card"
        id="new-card"
        placeholder={`Enter a title for this ${type}...`}
        ref={textAreaRef}
      ></textarea>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        save
      </motion.button>
    </motion.div>
  )
}

export default NewCard
