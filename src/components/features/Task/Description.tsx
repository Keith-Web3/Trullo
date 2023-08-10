import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

import { getTaskDescription, updateTaskDescription } from '../../utils/apis'
import Loader from '../../ui/Loader'

interface DescriptionProps {
  taskId: number
}
const Description = function ({ taskId }: DescriptionProps) {
  const queryClient = useQueryClient()
  const { isLoading, data } = useQuery({
    queryKey: ['get-task-description', taskId],
    queryFn: getTaskDescription(taskId),
  })
  const { isLoading: isUpdating, mutate } = useMutation({
    mutationFn: updateTaskDescription,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['get-task-description', taskId],
      })
      setIsEditing(false)
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current === null) return
    textAreaRef.current!.style.height = `${textAreaRef.current!.scrollHeight}px`
  }, [isEditing])

  return (
    <div className="task-info__description">
      <div className="description-header">
        <p>
          <img src="/description.svg" alt="description" />
          description
        </p>
        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="edit-btn"
          disabled={isLoading}
          onClick={() => setIsEditing(true)}
        >
          <img src="/edit.svg" alt="edit" />
          edit
        </motion.button>
      </div>
      <pre className="description">
        {isLoading ? <Loader /> : !isEditing && data}
      </pre>
      {!Boolean(data) && !isEditing && (
        <p className="no-description">This task has no description</p>
      )}
      {isEditing && (
        <>
          <textarea
            defaultValue={data}
            name="edit-description"
            className="edit-input"
            ref={textAreaRef}
            onKeyUp={e => {
              ;(e.target as HTMLTextAreaElement).style.height = 'auto'
              const scHeight = (e.target as HTMLTextAreaElement).scrollHeight
              ;(e.target as HTMLTextAreaElement).style.height = `${scHeight}px`
            }}
          />
          <div className="edit-btn-container">
            <button
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
              disabled={isUpdating}
            >
              cancel
            </button>
            <button
              className="save-btn"
              disabled={isUpdating}
              onClick={() => {
                if (
                  textAreaRef.current &&
                  textAreaRef.current?.value.trim() === ''
                ) {
                  toast.error('Please enter a description')
                  return
                }
                mutate({ taskId, description: textAreaRef.current!.value })
              }}
            >
              {isUpdating && <Loader />} save
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Description

// Ideas are created and share here through a card. Here you can describe
//         what you'd like to accomplish. For example you can follow three simple
//         questions to create the card related to your idea: * Why ? (Why do you
//         wish to do it ?) * What ? (What it is it, what are the goals, who is
//         concerned) * How ? (How do you think you can do it ? What are the
//         required steps ?) After creation, you can move your card to the todo
//         list.
