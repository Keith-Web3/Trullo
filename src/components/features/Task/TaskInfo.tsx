import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import Img from '../../ui/Img'
import Messages from '../Messages'
import Actions from './Actions'
import Attachments from './Attachments'
import '../../../sass/features/task/task-info.scss'
import PhotoSearch from '../PhotoSearch'
import { updateTaskCover } from '../../utils/apis'
import Description from './Description'

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
  const photoSearchRef = useRef<HTMLDivElement>(null)
  const [coverSrc, setCoverSrc] = useState(coverImg)
  const [coverHash, setCoverHash] = useState(coverBlurHash)
  const [showPhotoSearch, setShowPhotoSearch] = useState(false)
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateTaskCover,
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
      if (
        photoSearchRef.current &&
        !photoSearchRef.current?.contains(e.target as Node)
      ) {
        setShowPhotoSearch(false)
      }
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
        <Description cardId={taskId} />
        <Attachments taskId={taskId} />
        <Messages taskId={taskId} userImg="/user.svg" />
      </div>
      <Actions
        listId={listId}
        taskId={taskId}
        setShowPhotoSearch={setShowPhotoSearch}
      >
        <AnimatePresence>
          {showPhotoSearch && (
            <PhotoSearch
              ref={photoSearchRef}
              setCoverSrc={setCoverSrc}
              setCoverBlurHash={setCoverHash}
            />
          )}
        </AnimatePresence>
      </Actions>
    </div>
  )
}

export default TaskInfo
