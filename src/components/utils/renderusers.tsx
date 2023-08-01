function renderUsers(
  users: (
    | {
        img: string
        name: string
      }
    | {
        img: undefined
        name: string
      }
  )[]
) {
  return users.map((el, idx) => {
    if (el.img !== undefined && el.img !== '')
      return <img src={el.img} alt={el.name} key={idx} />
    return (
      <div className="renderedImage" key={idx}>
        {el.name
          ?.split(' ')
          .map(el => el[0])
          .join('')
          .toUpperCase()}
      </div>
    )
  })
}

export { renderUsers }
