import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Button from '../../ui/Button'
import '../../../sass/pages/board/add-board.scss'
import PhotoSearch from '../../features/PhotoSearch'
import { addBoard, getUser } from '../../utils/apis'
import Loader from '../../ui/Loader'
import { requireAuth } from '../../utils/requireAuth'
import Visibility from '../../ui/Visibility'

interface AddCardProps {
  setIsAddCardModalShown: React.Dispatch<React.SetStateAction<boolean>>
}

const AddBoard = function ({ setIsAddCardModalShown }: AddCardProps) {
  const [isSearchModalShown, setIsSearchModalShown] = useState(false)
  const [isVisibilityModalShown, setIsVisibilityModalShown] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addBoardRef = useRef<HTMLDivElement>(null)
  const visibilityRef = useRef<HTMLDivElement>(null)
  const photoSearchRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()
  const [coverSrc, setCoverSrc] = useState(
    `https://source.unsplash.com/random/?collaboration?${
      Math.random() * 100000
    }`
  )
  const { mutate, isLoading } = useMutation({
    mutationFn: addBoard,
    onSuccess: () => {
      toast.success('Successful')
      queryClient.invalidateQueries({ queryKey: ['getBoards'] })
    },
  })

  const handleOuterClick: (this: HTMLElement, ev: MouseEvent) => any =
    function (e) {
      if (
        addBoardRef.current &&
        !addBoardRef.current!.contains(e.target as Node)
      ) {
        setIsAddCardModalShown(false)
      }
      if (
        visibilityRef.current &&
        !visibilityRef.current!.contains(e.target as Node)
      ) {
        setIsVisibilityModalShown(false)
      }
      if (
        photoSearchRef.current &&
        !photoSearchRef.current!.contains(e.target as Node)
      ) {
        setIsSearchModalShown(false)
      }
    }

  useEffect(() => {
    document
      .getElementById('modal-root')
      ?.addEventListener('click', handleOuterClick, true)

    return () =>
      document
        .getElementById('modal-root')
        ?.removeEventListener('click', handleOuterClick)
  }, [])

  const handleCreateBoard: React.MouseEventHandler<HTMLButtonElement> =
    async function () {
      if (isLoading) return
      if (!inputRef.current!.value.trim()) {
        inputRef.current!.focus()
        toast.error('Please add a board title')
        return
      }

      const user = await requireAuth()
      let name = user!.user_metadata.name

      if (!name) {
        const users = await getUser(user!.id)
        name = users?.[0].name
      }
      const currentUser = {
        name,
        img: user!.user_metadata.avatar_url,
        id: user!.id,
      }

      mutate({
        name: inputRef.current!.value,
        users: [currentUser],
        cover_img: coverSrc,
        isPrivate: isPrivate,
      })
    }

  return (
    <div className="add-board" ref={addBoardRef}>
      <div className="cover-photo">
        <img
          src="/close.svg"
          alt="close"
          className="close-btn"
          onClick={() => setIsAddCardModalShown(prev => !prev)}
        />
        <img className="cover-img" src={coverSrc} alt="random-unsplash-photo" />
      </div>
      <input type="text" ref={inputRef} placeholder="Add board title" />
      <div className="btn-container">
        <Button tag onClick={() => setIsSearchModalShown(prev => !prev)}>
          <img src="/gallery.svg" alt="gallery" />
          <span>Cover</span>
          <AnimatePresence>
            {isSearchModalShown && (
              <PhotoSearch setCoverSrc={setCoverSrc} ref={photoSearchRef} />
            )}
          </AnimatePresence>
        </Button>
        <Button tag onClick={() => setIsVisibilityModalShown(prev => !prev)}>
          <img
            src={isPrivate ? '/private.svg' : '/public.svg'}
            alt="visibility"
          />
          <span>{isPrivate ? 'Private' : 'Public'}</span>
          <AnimatePresence>
            {isVisibilityModalShown && (
              <Visibility setIsPrivate={setIsPrivate} ref={visibilityRef} />
            )}
          </AnimatePresence>
        </Button>
      </div>
      <div className="footer">
        <button onClick={() => setIsAddCardModalShown(false)}>Cancel</button>
        <button disabled={isLoading} onClick={handleCreateBoard}>
          {isLoading ? (
            <>
              <Loader
                width="24px"
                ringWidth="3px"
                loaderColor="#ffffff"
                ringColor="#2f80ed"
              />
              Creating...
            </>
          ) : (
            <>
              <span>+</span> Create
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default AddBoard
