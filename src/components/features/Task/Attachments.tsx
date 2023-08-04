const Attachments = function () {
  return (
    <div className="attachments">
      <div className="description-header">
        <p>
          <img src="/description.svg" alt="attachments" />
          attachments
        </p>
        <button className="edit-btn">
          <img src="/add.svg" alt="add" />
          add
        </button>
      </div>
    </div>
  )
}

export default Attachments
