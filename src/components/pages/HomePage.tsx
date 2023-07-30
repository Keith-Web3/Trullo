import { useState } from 'react'
import { createPortal } from 'react-dom'

import mockData from '../data'
import BoardCard from '../ui/BoardCard'
import Button from '../ui/Button'
import '../../sass/pages/homepage.scss'
import AddBoard from './Board/AddBoard'

const HomePage = function () {
  const [isAddCardModalShown, setIsAddCardModalShown] = useState(false)
  return (
    <div className="homepage">
      <div className="homepage__header">
        <p>all boards</p>
        <Button onClick={() => setIsAddCardModalShown(prev => !prev)}>
          + Add
        </Button>
      </div>
      <div className="boards">
        {mockData.map(el => (
          <BoardCard
            key={el.id}
            id={el.id}
            name={el.name}
            image={el.image}
            users={el.users}
          />
        ))}
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
