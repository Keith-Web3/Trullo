export type Users = (
  | {
      img: string
      name: string
      id?: string
    }
  | {
      img: undefined
      name: string
      id?: string
    }
)[]
//TODO figure out use of Id

function renderUsers(users: Users) {
  return users.map((el, idx) => {
    if (el.img != undefined && el.img !== '') {
      return <img src={el.img} title={el.name} alt={el.name} key={idx} />
    }
    return (
      <div className="renderedImage" key={idx} title={el.name}>
        {formatName(el.name)}
      </div>
    )
  })
}

export function formatName(name: string) {
  if (name.split(' ').length < 2) {
    return name.split('').slice(0, 2).join('').toUpperCase()
  }
  return name
    .split(' ')
    .map(el => el[0])
    .join('')
    .toUpperCase()
}

export { renderUsers }
