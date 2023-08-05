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
      task_name: string
      list_id: number
      users: { name?: string; img: string; id: string }[]
    }

const addBoard = async function (boardData: BoardData) {
  const { data, error } = await supabase
    .from('Boards')
    .insert([boardData])
    .select()

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
  const { error } = await supabase.from('BoardList').insert([listData]).select()
  if (error) toast.error(error.message)
  if (!error) toast.success('Saved successfully')
}
const addTask = async function (taskData: ListData) {
  const { error } = await supabase.from('Tasks').insert([taskData]).select()
  if (error) toast.error(error.message)
  if (!error) toast.success('Saved successfully')
}

const getLists = function (boardId: number) {
  return async function () {
    const { data: boardList, error } = await supabase
      .from('BoardList')
      .select('*')
      .eq('board_id', boardId)
    if (error) toast.error(error.message)
    return boardList
  }
}

const getBoard = function (boardId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('Boards')
      .select('*')
      .eq('id', boardId)
    if (error) toast.error('Could not fetch board data')
    return data
  }
}

const getListTasks = function (listId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('Tasks')
      .select('*')
      .eq('list_id', listId)
    if (error) toast.error(error.message)
    return data
  }
}

const updateTaskCover = async function ({
  taskId,
  src,
  coverHash,
}: {
  taskId: number
  src: string
  coverHash: string
}) {
  const { error } = await supabase
    .from('Tasks')
    .update({ image: src, image_blurhash: coverHash })
    .eq('id', taskId)
    .select()
  if (error) toast.error(error.message)
}

const updateTaskTags = async function ({
  tags,
  taskId,
}: {
  tags: { text: string; color: string }[]
  taskId: number
}) {
  const { data: tasks, error: fetchError } = await supabase
    .from('Tasks')
    .select('tags')
    .eq('id', taskId)
  if (fetchError) {
    toast.error(fetchError.message)
    return
  }

  let merged = [...(tasks[0]?.tags || []), ...tags]

  merged = merged.reduceRight((acc, el) => {
    if (
      acc.some(
        (obj: { text: string; color: string }) =>
          obj.text.toLowerCase() === el.text.toLowerCase()
      )
    )
      return acc
    return [...acc, el]
  }, [])

  const { error } = await supabase
    .from('Tasks')
    .update({ tags: merged })
    .eq('id', taskId)
    .select()
  if (error) toast.error(error.message)
}

export {
  addBoard,
  getBoards,
  getUser,
  addList,
  getLists,
  getBoard,
  addTask,
  getListTasks,
  updateTaskCover,
  updateTaskTags,
}
