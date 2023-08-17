import { toast } from 'react-hot-toast'
import { deleteObject, ref } from 'firebase/storage'

import { supabase } from '../data/supabase'
import { getUserDetails, requireAuth } from './requireAuth'
import { storage } from '../data/firebase'
import calculateSize from './calculateSize'

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
      board_id: number
      users: {
        name?: string
        img: string
        id: string
        role: 'admin' | 'user'
      }[]
    }

interface NewMessage {
  messageData: {
    task_id: number
    message: string
  }
  notificationData: {
    board_id: number
    task_id: number
  }
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
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
  if (!error) {
    toast.success('Saved successfully')
    if ('name' in listData && 'board_id' in listData) {
      return async function () {
        const userDetails = await getUserDetails()
        await supabase.rpc('create_board_notifications', {
          board_id: listData.board_id,
          sender_name: userDetails.name,
          sender_img: userDetails.img || '',
          sender_id: userDetails.id,
          message: `created a new list: ${listData.name}`,
        })
      }
    }
  }
}
const addTask = async function (taskData: ListData) {
  const newTaskData: Partial<ListData> = { ...taskData }
  delete newTaskData.board_id

  const { error } = await supabase.from('Tasks').insert([newTaskData]).select()
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
  if (!error) {
    toast.success('Saved successfully')
    if ('task_name' in taskData)
      return async function () {
        const userDetails = await getUserDetails()

        await supabase.rpc('create_board_notifications', {
          board_id: taskData.board_id,
          sender_name: userDetails.name,
          sender_img: userDetails.img || '',
          sender_id: userDetails.id,
          message: `created a new task: ${taskData.task_name}`,
        })
      }
  }
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
  boardId,
}: {
  taskId: number
  description: string
  boardId: number
}) {
  const { data, error } = await supabase
    .from('Tasks')
    .update({ description })
    .eq('id', taskId)
    .select()

  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
  if (data.length === 0) {
    toast.error('Unauthorized to edit this task.')
    return
  }
  toast.success('Description successfully updated')

  return async function () {
    const userDetails = await getUserDetails()

    await supabase.rpc('create_notifications_for_task_users', {
      board_id: boardId,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      sender_id: userDetails.id,
      task_id: taskId,
      message_sent: 'updated the description of the',
    })
  }
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
  if (error) {
    toast.error('Error fetching user details')
    throw new Error('Error fetching user details')
  }
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

const getUsers = function (searchQuery: string, boardId: number) {
  return async function () {
    const user = await requireAuth()

    const { data: boards, error: boardsError } = await supabase
      .from('Boards')
      .select('users')
      .eq('id', boardId)
    const users = boards?.[0].users

    if (boardsError) toast.error(boardsError.message)

    if (searchQuery.trim() === '') {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('user_id', user!.id)
        .range(0, 2)
      if (error) toast.error('Error fetching users')
      if (data?.length === 0) toast.error('Could not find user')
      return data?.filter(
        userData =>
          !users.some((user: { id: number }) => user.id === userData.user_id)
      ) as {
        name: string
        email: string
        user_id: string
        img: string | null
        id: number
      }[]
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${searchQuery}%, email.eq.${searchQuery}`)
      .neq('user_id', user!.id)
    if (error) toast.error('Error fetching users')
    if (data?.length === 0) toast.error('Could not find user')
    return data?.filter(
      userData =>
        !users.some((user: { id: number }) => user.id === userData.user_id)
    ) as {
      name: string
      email: string
      user_id: string
      img: string | null
      id: number
    }[]
  }
}
const getTaskUsers = function (
  searchQuery: string,
  boardId: number,
  taskId: number
) {
  return async function () {
    const users = await getTaskMembers(taskId)()

    const { data: boardUsers, error: usersError } = await supabase
      .from('Boards')
      .select('users')
      .eq('id', boardId)
    if (usersError) toast.error('Error fetching users')

    const boardUsersExtracted = boardUsers?.[0].users.filter(
      (boardUser: { id: string }) =>
        !users.some((user: { id: string }) => user.id === boardUser.id)
    )

    if (searchQuery.trim() === '') {
      return boardUsersExtracted.slice(0, 3) as {
        id: string
        name: string
        img?: string
      }[]
    }
    return boardUsersExtracted.filter(
      (boardUser: { name: string }) =>
        boardUser.name.trim().toLowerCase() === searchQuery.trim().toLowerCase()
    ) as { id: string; name: string; img?: string }[]
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
      invitation_id: `${board_id}-${detail}`,
      inviter_img: userDetails.img,
    }
  })

  const { error } = await supabase.from('invites').insert(invitations)
  if (
    error?.message ===
    'duplicate key value violates unique constraint "invites_invitation_id_key"'
  ) {
    toast.error('This user has already been invited')
    throw new Error('This user has already been invited')
  } else if (
    error?.message ===
    'new row violates row-level security policy for table "invites"'
  ) {
    toast.error('The user is already a member of this board')
    throw new Error('The user is already a member of this board')
  }
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
  toast.success('Board Access Invitations Sent')

  return async function () {
    const { data } = await supabase
      .from('users')
      .select('name')
      .in('user_id', inviteDetails)

    const suffix =
      data?.length! > 2
        ? ` and ${data?.length! - 2} more user${
            data?.length! - 2 === 1 ? '' : 's'
          }`
        : ''
    const invitedUsers =
      data
        ?.map(user => user.name)
        .slice(0, 2)
        .join(', ') + suffix
    await supabase.rpc('create_board_notifications', {
      board_id: board_id,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      sender_id: userDetails.id,
      message: `invited ${invitedUsers} to the board.`,
    })
  }
}

const getNotifications = async function () {
  const { data, error } = await supabase.from('invites').select('*')
  if (error) toast.error(error.message)
  return data
}

const replyInvitation = async function ({
  id,
  response,
  boardId,
}: {
  id: number
  response: 'declined' | 'accepted'
  boardId: number
}) {
  const toastId = toast.loading('Replying invite')

  const { error } = await supabase
    .from('invites')
    .update({ status: response })
    .eq('id', id)
    .select()
  if (error) {
    toast.dismiss(toastId)
    throw error
  }
  if (response === 'accepted') {
    const userDetails = await getUserDetails()
    const { error } = await supabase.rpc('add_user_to_board', {
      board_id: +boardId,
      new_user: userDetails,
    })

    await supabase.rpc('create_board_notifications', {
      board_id: boardId,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      sender_id: userDetails.id,
      message: ' has joined the board!',
    })

    if (error) {
      toast.dismiss(toastId)
      throw error
    }
  }
  if (!error) {
    await supabase.from('invites').delete().eq('id', id)
  }
  toast.dismiss(toastId)
}

const assignUsersToBoard = async function ({
  users,
  taskId,
  boardId,
}: {
  users: { img?: string; id: string; name: string; role: 'assignee' }[]
  taskId: number
  boardId: number
}) {
  const { error, data } = await supabase.rpc('add_users_to_task', {
    task_id: taskId,
    new_users: users,
  })
  console.log(error, data)
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }

  return async function () {
    const userDetails = await getUserDetails()

    await supabase.rpc('insert_board_notifications', {
      board_id: boardId,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      task_id: taskId,
      users,
    })
  }
}

const getBoardNotifications = function (boardId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('board_notifications')
      .select('*')
      .eq('board_id', boardId)
    if (error) toast.error('Error fetching notifications')
    return data
  }
}

const sendMessage = async function ({
  messageData,
  notificationData,
}: NewMessage) {
  const userDetails = await getUserDetails()

  const { error } = await supabase
    .from('Messages')
    .insert([
      {
        ...messageData,
        sender_img: userDetails.img,
        sender_name: userDetails.name,
        sender_id: userDetails.id,
      },
    ])
    .select()

  if (error) {
    if (
      error.message ===
      'new row violates row-level security policy for table "Messages"'
    ) {
      toast.error("You're not authorized to comment on this task.")
      throw new Error(error.message)
    }
    toast.error(error.message)
    throw new Error(error.message)
  }
  return async function () {
    await supabase.rpc('create_notifications_for_task_users', {
      board_id: notificationData.board_id,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      sender_id: userDetails.id,
      task_id: notificationData.task_id,
      message_sent: 'made a new comment in the',
    })
  }
}
const getMessages = function (taskId: number) {
  return async function () {
    const user = await requireAuth()
    const { data, error } = await supabase
      .from('Messages')
      .select('*')
      .eq('task_id', taskId)
    if (error) {
      toast.error('Error fetching messages')
      throw new Error(error.message)
    }
    return { data, userId: user!.id }
  }
}

const editMessage = async function ({
  message,
  id,
}: {
  message: string
  id: number
}) {
  const { error } = await supabase
    .from('Messages')
    .update({ message })
    .eq('id', id)
    .select()
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
}

const deleteMessage = async function (id: number) {
  const toastId = toast.loading('deleting...')
  const { error } = await supabase.from('Messages').delete().eq('id', id)
  toast.dismiss(toastId)
  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }
}

const uploadFile = async function ({
  taskId,
  url,
  fileType,
  name,
  customId,
  boardId,
  size,
}: {
  taskId: number
  url: string
  fileType: string
  name: string
  customId: string
  boardId: number
  size: number
}) {
  const user = await requireAuth()
  const { error } = await supabase
    .from('Files')
    .insert([
      {
        task_id: taskId,
        file_type: fileType,
        sender_id: user!.id,
        file_name: name,
        custom_id: customId,
        url,
      },
    ])
    .select()
  if (error) {
    toast.error('Error uploading file')
    throw new Error(error.message)
  }
  toast.success('successfully uploaded file')
  return async function () {
    const userDetails = await getUserDetails()
    await supabase.rpc('create_notifications_for_task_users', {
      board_id: boardId,
      sender_name: userDetails.name,
      sender_img: userDetails.img || '',
      sender_id: userDetails.id,
      task_id: taskId,
      message_sent: `uploaded a ${calculateSize(size)} file to the`,
    })
  }
}

const fetchAttachments = function (taskId: number) {
  return async function () {
    const { data, error } = await supabase
      .from('Files')
      .select('*')
      .eq('task_id', taskId)
    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }
    return data
  }
}

const deleteFile = async function ({
  taskId,
  customId,
}: {
  taskId: number
  customId: string
}) {
  const toastId = toast.loading('deleting file')
  const { error } = await supabase
    .from('Files')
    .delete()
    .eq('custom_id', customId)

  if (error) {
    toast.dismiss(toastId)
    toast.error(error.message)
    throw new Error(error.message)
  }

  const fileRef = ref(storage, `${taskId}/${customId}`)

  deleteObject(fileRef)
    .then(() => {
      toast.dismiss(toastId)
      toast.success('deleted file successfully')
    })
    .catch(error => {
      toast.dismiss(toastId)
      toast.error(error.message)
      throw new Error(error.message)
    })
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
  getNotifications,
  replyInvitation,
  getTaskUsers,
  assignUsersToBoard,
  getBoardNotifications,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  uploadFile,
  fetchAttachments,
  deleteFile,
}
