import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'

import BoardCard from '../ui/BoardCard'
import Button from '../ui/Button'
import '../../sass/pages/homepage.scss'
import AddBoard from './Board/AddBoard'
import { getBoards } from '../utils/apis'
import BoardCardSkeleton from '../ui/BoardCardSkeleton'

const HomePage = function () {
  const [isAddCardModalShown, setIsAddCardModalShown] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['getBoards'],
    queryFn: getBoards,
  })

  return (
    <div className="homepage">
      <div className="homepage__header">
        <p>all boards</p>
        <Button onClick={() => setIsAddCardModalShown(prev => !prev)}>
          + Add
        </Button>
      </div>
      <div className="boards">
        {isLoading ? (
          <>
            <BoardCardSkeleton />
            <BoardCardSkeleton />
            <BoardCardSkeleton />
            <BoardCardSkeleton />
          </>
        ) : (
          data!.map(el => (
            <BoardCard
              key={el.id}
              id={el.id}
              name={el.name}
              image={el.cover_img}
              users={el.users}
              blurhash={el.cover_blurhash}
            />
          ))
        )}
        {isAddCardModalShown &&
          createPortal(
            <AddBoard setIsAddCardModalShown={setIsAddCardModalShown} />,
            document.getElementById('modal-root')!
          )}
      </div>
    </div>
  )
}

export default HomePage
