import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { UseMutateFunction } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import '../../sass/shared/new-card.scss'
import { ListData } from '../utils/apis'
import Loader from '../ui/Loader'
import { getUserDetails } from '../utils/requireAuth'

interface NewCardProps {
  setCardDisplay:
    | React.Dispatch<React.SetStateAction<number | boolean>>
    | React.Dispatch<React.SetStateAction<boolean>>
  type: string
  mutate: UseMutateFunction<
    (() => Promise<void>) | undefined,
    unknown,
    ListData,
    unknown
  >
  isLoading: boolean
  id?: number
  tasksLength?: number
}

const NewCard = function ({
  setCardDisplay,
  type,
  mutate,
  isLoading,
  id,
  tasksLength,
}: NewCardProps) {
  const params = useParams<{ boardId: string }>()
  const newCardRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOuterClick = function (e: MouseEvent) {
    if (newCardRef.current && !newCardRef.current!.contains(e.target as Node)) {
      setCardDisplay(false)
    }
  }

  const handleSubmitList: React.MouseEventHandler<HTMLButtonElement> =
    async function () {
      if (textAreaRef.current && !textAreaRef.current!.value) {
        toast.error('Please enter a list name')
        textAreaRef.current.focus()
        return
      }
      const mutateData =
        type === 'list'
          ? {
              name: textAreaRef.current!.value,
              board_id: +params.boardId!,
            }
          : {
              task_name: textAreaRef.current!.value,
              list_id: id!,
              board_id: +params.boardId!,
              order: tasksLength!,
              'order-id': `${id!}-${tasksLength!}`,
              users: [
                { ...(await getUserDetails()), role: 'admin' as 'admin' },
              ],
            }
      mutate(mutateData)
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
        onKeyDown={e => {
          if (e.key === 'Enter' && !isLoading) {
            e.preventDefault()
            ;(handleSubmitList as () => void)()
          }
        }}
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
