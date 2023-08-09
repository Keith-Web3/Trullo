import { toast } from 'react-hot-toast'
import { supabase } from '../data/supabase'
import { getUserDetails, requireAuth } from './requireAuth'

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
      users: {
        name?: string
        img: string
        id: string
        role: 'admin' | 'user'
      }[]
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

const getTaskDescription = function (taskId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('Tasks')
      .select('description')
      .eq('id', taskId)
    if (error) toast.error(error.message)
    return data?.[0].description
  }
}

const updateTaskDescription = async function ({
  taskId,
  description,
}: {
  taskId: number
  description: string
}) {
  const { data, error } = await supabase
    .from('Tasks')
    .update({ description })
    .eq('id', taskId)
    .select()

  if (error) toast.error(error.message)
  return data
}

const getTaskMembers = function (taskId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('Tasks')
      .select('users')
      .eq('id', taskId)
    if (error) toast.error(error.message)
    return data?.[0].users
  }
}

const uploadUserOnSignUp = async function () {
  const {
    data: { user },
    error,
  } = await supabase.auth.refreshSession()
  if (error) toast.error('Error fetching user details')
  if (user?.created_at!.slice(0, -7) !== user?.last_sign_in_at!.slice(0, -7))
    return

  const { error: nameError } = await supabase
    .from('users')
    .insert([
      {
        user_id: user?.id,
        name: user?.user_metadata.full_name,
        email: user?.email,
        img: user?.user_metadata.avatar_url,
      },
    ])
    .select()
  if (nameError) toast.error('Error uploading user details')
}

const getUsers = function (searchQuery: string) {
  return async function () {
    const user = await requireAuth()
    if (searchQuery.trim() === '') {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('user_id', user!.id)
        .range(0, 2)
      if (error) toast.error('Error fetching users')
      if (data?.length === 0) toast.error('Could not find user')
      return data
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${searchQuery}%, email.eq.${searchQuery}`)
      .neq('user_id', user!.id)
    if (error) toast.error('Error fetching users')
    if (data?.length === 0) toast.error('Could not find user')
    return data
  }
}

const sendInvite = async function ({
  inviteDetails,
  board_id,
  board_name,
}: {
  inviteDetails: string[]
  board_id: number
  board_name: string
}) {
  const userDetails = await getUserDetails()

  const invitations = inviteDetails.map(detail => {
    return {
      status: 'pending',
      board_id,
      board_name,
      inviter_name: userDetails.name,
      invited_user_id: detail,
    }
  })

  const { data, error } = await supabase
    .from('invites')
    .insert(invitations)
    .select()
  console.log(data)
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
  getTaskDescription,
  updateTaskDescription,
  getTaskMembers,
  uploadUserOnSignUp,
  getUsers,
  sendInvite,
}
