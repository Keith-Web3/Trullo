function renderUsers(
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
) {
  return users.map((el, idx) => {
    if (el.image !== null && el.image !== '')
      return <img src={el.image} alt={el.name} key={idx} />
    return (
      <div className="renderedImage" key={idx}>
        {el.name
          .split(' ')
          .map(el => el[0])
          .join('')
          .toUpperCase()}
      </div>
    )
  })
}

export { renderUsers }
