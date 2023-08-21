import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import {
  getTaskDescription,
  updateBoardDescription,
  updateTaskDescription,
} from '../../utils/apis'
import Loader from '../../ui/Loader'
import useNotifyOnSuccess from '../../hooks/useNotifyOnSuccess'
import '../../../sass/features/task/description.scss'

interface DescriptionProps {
  cardId?: number
  boardDescription?: string
}
const Description = function ({ cardId, boardDescription }: DescriptionProps) {
  const queryClient = useQueryClient()
  const params = useParams()
  const { isLoading, data } = useQuery({
    queryKey: ['get-task-description', cardId!],
    queryFn: getTaskDescription(cardId!),
    enabled: boardDescription === undefined,
  })
  const {
    isLoading: isUpdating,
    mutate,
    isSuccess,
  } = useMutation({
    mutationFn: updateTaskDescription,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ['get-task-description', cardId],
      })
      setIsEditing(false)
      handleNotify(data!)
    },
  })
  const {
    isLoading: isUpdatingBoard,
    mutate: mutateBoard,
    isSuccess: isBoardUpdateSuccess,
  } = useMutation({
    mutationFn: updateBoardDescription,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ['get-board', params.boardId],
      })
      setIsEditing(false)
      handleNotify(data!)
    },
  })
  const handleNotify = useNotifyOnSuccess(
    boardDescription === undefined ? isSuccess : isBoardUpdateSuccess
  )
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current === null) return
    textAreaRef.current!.style.height = `${textAreaRef.current!.scrollHeight}px`
    textAreaRef.current!.focus()
  }, [isEditing])

  return (
    <div className="card-description">
      <div className="description-header">
        <p>
          <img src="/description.svg" alt="description" />
          description
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="edit-btn"
          disabled={boardDescription === undefined ? isLoading : false}
          onClick={() => setIsEditing(true)}
        >
          <img src="/edit.svg" alt="edit" />
          edit
        </motion.button>
      </div>
      <pre className="description">
        {boardDescription === undefined ? (
          isLoading ? (
            <Loader />
          ) : (
            !isEditing && data
          )
        ) : (
          !isEditing && boardDescription
        )}
      </pre>
      {(boardDescription === undefined
        ? !Boolean(data)
        : !Boolean(boardDescription)) &&
        !isEditing && (
          <p className="no-description">This task has no description</p>
        )}
      {isEditing && (
        <>
          <textarea
            defaultValue={boardDescription || data}
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
              disabled={isUpdating || isUpdatingBoard}
            >
              cancel
            </button>
            <button
              className="save-btn"
              disabled={isUpdating || isUpdatingBoard}
              onClick={() => {
                if (
                  textAreaRef.current &&
                  textAreaRef.current?.value.trim() === ''
                ) {
                  toast.error('Please enter a description')
                  return
                }
                boardDescription === undefined
                  ? mutate({
                      taskId: cardId!,
                      description: textAreaRef.current!.value,
                      boardId: +params.boardId!,
                    })
                  : mutateBoard({
                      id: +params.boardId!,
                      boardInfo: textAreaRef.current!.value,
                    })
              }}
            >
              {(isUpdating || isUpdatingBoard) && <Loader />} save
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Description
