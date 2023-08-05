import Button from '../ui/Button'
import '../../sass/features/messages.scss'

interface MessagesProps {
  userImg: string
}
function Messages({ userImg }: MessagesProps) {
  return (
    <div className="messages">
      <div className="text-box">
        <img src={userImg} alt="user" />
        <textarea
          name="message"
          id="message"
          className="text-input"
          placeholder="Write a comment..."
          onKeyUp={e => {
            ;(e.target as HTMLTextAreaElement).style.height = 'auto'
            const scHeight = (e.target as HTMLTextAreaElement).scrollHeight
            ;(e.target as HTMLTextAreaElement).style.height = `${scHeight}px`
          }}
        ></textarea>
        <Button>Comment</Button>
      </div>
      <div className="messages__container"></div>
    </div>
  )
}

export default Messages
