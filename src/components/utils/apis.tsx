import { toast } from 'react-hot-toast'
import { supabase } from '../data/supabase'

interface BoardData {
  name: string
  users: {
    name: string | null
    img: string | null
    id: string
  }[]
  cover_img: string
  isPrivate: boolean
}

const addBoard = async function (boardData: BoardData) {
  const { data, error } = await supabase
    .from('Boards')
    .insert([boardData])
    .select()
  console.log(data)

  if (error) toast.error(error.message)
  return data
}

const getBoards = async function () {
  const { data: Boards, error } = await supabase.from('Boards').select('*')
  if (error) toast.error(error.message)
  return Boards
}

const getUser = async function (id: string) {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', id)
  if (error) toast.error('Error getting user')
  return users
}

export { addBoard, getBoards, getUser }
