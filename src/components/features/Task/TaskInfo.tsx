import { motion } from 'framer-motion'

import Img from '../../ui/Img'
import Messages from '../Messages'
import Actions from './Actions'
import Attachments from './Attachments'
import '../../../sass/features/task/task-info.scss'
import { useEffect, useRef, useState } from 'react'
import PhotoSearch from '../PhotoSearch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeTaskCover } from '../../utils/apis'

interface TaskinfoProps {
  coverImg: string
  coverBlurHash: string
  taskId: number
  taskName: string
  listName: string
  listId: number
  setIsTaskInfoShown: React.Dispatch<React.SetStateAction<boolean>>
}
const TaskInfo = function ({
  coverImg,
  coverBlurHash,
  taskName,
  listName,
  taskId,
  listId,
  setIsTaskInfoShown,
}: TaskinfoProps) {
  const taskInfoRef = useRef<HTMLDivElement>(null)
  const [coverSrc, setCoverSrc] = useState(coverImg)
  const [coverHash, setCoverHash] = useState(coverBlurHash)
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: changeTaskCover,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-tasks', listId] })
    },
  })

  const handleOuterClick: (this: HTMLElement, ev: MouseEvent) => any =
    function (e) {
      if (
        taskInfoRef.current &&
        !taskInfoRef.current?.contains(e.target as Node)
      )
        setIsTaskInfoShown(false)
    }

  useEffect(() => {
    document
      .getElementById('modal-root')!
      .addEventListener('click', handleOuterClick, true)

    return () =>
      document
        .getElementById('modal-root')!
        .removeEventListener('click', handleOuterClick)
  }, [])
  useEffect(() => {
    mutate({ taskId, src: coverSrc, coverHash })
  }, [coverSrc])

  return (
    <div className="task-info" ref={taskInfoRef}>
      {!!coverSrc && (
        <div className="cover-container">
          <img
            src="/close.svg"
            onClick={e => {
              e.stopPropagation()
              setIsTaskInfoShown(prev => !prev)
            }}
            className="cancel"
            alt="close"
          />
          <Img
            src={coverSrc}
            className="cover__img"
            blurhash={coverHash}
            alt="cover_img"
          />
        </div>
      )}
      <div className="task-info__main">
        <h1>{taskName}</h1>
        <p className="task-list">
          in list
          <span>{listName}</span>
        </p>
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
            >
              <img src="/edit.svg" alt="edit" />
              edit
            </motion.button>
          </div>
          <p className="description">
            Ideas are created and share here through a card. Here you can
            describe what you'd like to accomplish. For example you can follow
            three simple questions to create the card related to your idea: *
            Why ? (Why do you wish to do it ?) * What ? (What it is it, what are
            the goals, who is concerned) * How ? (How do you think you can do it
            ? What are the required steps ?) After creation, you can move your
            card to the todo list.
          </p>
        </div>
        <Attachments />
        <Messages userImg="/user.svg" />
      </div>
      <Actions>
        <PhotoSearch
          setCoverSrc={setCoverSrc}
          setCoverBlurHash={setCoverHash}
        />
      </Actions>
    </div>
  )
}

export default TaskInfo
