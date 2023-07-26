import '../../sass/ui/boardcard.scss'

interface BoardCardProps {
  name: string
  image: string
  users: (
    | {
        image: string
        name: string
      }
    | {
        image: null
        name: string
      }
  )[]
}
const BoardCard = function ({ name, image, users }: BoardCardProps) {
  const displayedUsers = users.slice(0, 3).map((el, idx) => {
    if (el.image !== null) return <img src={el.image} alt={el.name} key={idx} />
    return (
      <div key={idx}>
        {el.name
          .split(' ')
          .map(el => el[0])
          .join('')
          .toUpperCase()}
      </div>
    )
  })
  const isUsersLong = users.length > 3

  return (
    <div className="board-card">
      <img src={image} className="board-card__image" alt="project" />
      <p>{name}</p>
      <div className="users">
        {displayedUsers} {isUsersLong && `+${users.length - 3} others`}
      </div>
    </div>
  )
}

export default BoardCard
