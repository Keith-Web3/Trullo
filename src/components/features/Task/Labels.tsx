import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { nanoid } from 'nanoid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import '../../../sass/features/task/labels.scss'
import { updateTaskTags } from '../../utils/apis'
import Loader from '../../ui/Loader'

interface LabelsProps {
  taskId: number
  listId: number
  setShowLabel: React.Dispatch<React.SetStateAction<boolean>>
}

const colors = [
  '33, 150, 83',
  '242, 201, 76',
  '242, 153, 74',
  '235, 87, 87',
  '47, 128, 237',
  '86, 204, 242',
  '155, 81, 224',
  '51, 51, 51',
  '79, 79, 79',
  '130, 130, 130',
  '189, 189, 189',
  '224, 224, 224',
]
const visibilityAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const Labels = function ({ taskId, listId, setShowLabel }: LabelsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [tags, setTags] = useState<{ text: string; color: string }[]>([])
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: updateTaskTags,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-tasks', listId] })
    },
  })

  const handleOuterClick: (this: HTMLElement, ev: MouseEvent) => any =
    function (e) {
      if (labelRef.current && !labelRef.current!.contains(e.target as Node)) {
        setShowLabel(false)
      }
    }

  useEffect(() => {
    document
      .getElementById('modal-root')!
      .addEventListener('click', handleOuterClick, true)
    inputRef.current!.focus()

    return () =>
      document
        .getElementById('modal-root')!
        .removeEventListener('click', handleOuterClick)
  }, [])
  useEffect(() => {
    inputRef.current!.value = ''
  }, [tags.length])

  return (
    <motion.div {...visibilityAnimation} className="labels" ref={labelRef}>
      <h1>label</h1>
      <p className="sub-header">Select a name and color</p>
      <input
        ref={inputRef}
        type="text"
        placeholder="Label..."
        onKeyDown={e => {
          if (e.key === 'Enter') toast.error('Please pick a color')
        }}
      />
      <div className="colors-container">
        {colors.map(color => (
          <div
            onClick={() => {
              if (inputRef.current && inputRef.current?.value.trim() === '') {
                toast.error('Please enter a label name first')
                inputRef.current.focus()
                return
              }
              setTags(prev => [
                ...prev,
                {
                  text: inputRef.current!.value.trim().toLowerCase(),
                  color,
                },
              ])
            }}
            key={color}
            style={{ backgroundColor: `rgb(${color})` }}
            className="color"
          ></div>
        ))}
      </div>
      <div className="current-labels">
        <p>
          <img src="/label.svg" alt="label" />
          Available
        </p>
        <div className="tags">
          {tags.map(tag => (
            <p
              key={nanoid()}
              style={{
                color: `rgb(${tag.color})`,
                backgroundColor: `rgba(${tag.color}, 0.25)`,
              }}
            >
              {tag.text}
            </p>
          ))}
        </div>
      </div>
      <button
        disabled={tags.length === 0 || isLoading}
        onClick={() => mutate({ tags, taskId })}
      >
        {isLoading && <Loader />}
        Add
      </button>
    </motion.div>
  )
}

export default Labels
