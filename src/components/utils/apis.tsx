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
  cover_blurhash: string
  isPrivate: boolean
}

export type ListData =
  | {
      name: string
      board_id: number
    }
  | {
      name: string
      list_id: number
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

const addList = async function (listData: ListData) {
  const { data, error } = await supabase
    .from('BoardList')
    .insert([listData])
    .select()
  if (error) toast.error(error.message)
  if (!error) toast.success('Saved successfully')
  console.log(data, error)
}

const getLists = async function (boardId: number) {
  const { data: boardList, error } = await supabase
    .from('BoardList')
    .select('*')
    .eq('board_id', boardId)
  console.log(boardList)
}
getLists(1)
// const addTask = async function (taskData: ListData) {

// }

export { addBoard, getBoards, getUser, addList }
