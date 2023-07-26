import mockData from '../data'
import BoardCard from '../ui/BoardCard'
import Button from '../ui/Button'
import '../../sass/pages/homepage.scss'

const HomePage = function () {
  return (
    <div className="homepage">
      <div className="homepage__header">
        <p>all boards</p>
        <Button>+ Add</Button>
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
      </div>
    </div>
  )
}

export default HomePage
