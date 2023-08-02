import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { UseMutateFunction } from '@tanstack/react-query'

import '../../sass/ui/new-card.scss'
import { ListData } from '../utils/apis'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from './Loader'

interface NewCardProps {
  setNewTaskIndex?: React.Dispatch<React.SetStateAction<number>>
  type: string
  mutate: UseMutateFunction<void, unknown, ListData, unknown>
  isLoading: boolean
}

const NewCard = function ({
  setNewTaskIndex,
  type,
  mutate,
  isLoading,
}: NewCardProps) {
  const params = useParams<{ boardId: string }>()
  const newCardRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOuterClick = function (e: MouseEvent) {
    if (newCardRef.current && !newCardRef.current!.contains(e.target as Node)) {
      setNewTaskIndex?.(-1)
    }
  }

  const handleSubmitList: React.MouseEventHandler<HTMLButtonElement> =
    function () {
      if (textAreaRef.current && !textAreaRef.current!.value) {
        toast.error('Please enter a list name')
        textAreaRef.current.focus()
        return
      }
      mutate({
        name: textAreaRef.current!.value,
        board_id: +params.boardId!,
      })
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
      <motion.button
        onClick={handleSubmitList}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        {isLoading && <Loader />} save
      </motion.button>
    </motion.div>
  )
}

export default NewCard
