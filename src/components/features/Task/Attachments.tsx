import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

import { storage } from '../../services/firebase'
import { deleteFile, fetchAttachments, uploadFile } from '../../utils/apis'
import formatDate from '../../utils/formatDate'
import FileSkeleton from '../../ui/FileSkeleton'
import useNotifyOnSuccess from '../../hooks/useNotifyOnSuccess'

interface AttachmentsProps {
  taskId: number
}

const Attachments = function ({ taskId }: AttachmentsProps) {
  let toastId: string
  const queryClient = useQueryClient()
  const params = useParams()
  const { mutate, isSuccess } = useMutation({
    mutationFn: uploadFile,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ['get-attachments', taskId] })
      handleNotify(data)
    },
    onSettled() {
      toast.dismiss(toastId)
    },
  })
  const handleNotify = useNotifyOnSuccess(isSuccess)
  const { mutate: handleDeleteFile } = useMutation({
    mutationFn: deleteFile,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-attachments', taskId] })
    },
  })
  const { data, isLoading } = useQuery({
    queryKey: ['get-attachments', taskId],
    queryFn: fetchAttachments(taskId),
  })

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> =
    async function (e) {
      const file = e.target.files![0]

      const customId = nanoid()
      const storageRef = ref(storage, `${taskId}/${customId}`)

      toastId = toast.loading('uploading file')

      const response = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(response.ref)

      mutate({
        taskId,
        url,
        fileType: file.type,
        name: file.name,
        customId,
        boardId: +params.boardId!,
        size: file.size,
      })
    }

  return (
    <div className="attachments">
      <div className="description-header">
        <p>
          <img src="/description.svg" alt="attachments" />
          attachments
        </p>
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          htmlFor="file-upload"
          className="edit-btn"
        >
          <input onChange={handleUpload} type="file" id="file-upload" />
          <img src="/add.svg" alt="add" />
          add
        </motion.label>
      </div>
      {isLoading ? (
        <>
          <FileSkeleton />
          <FileSkeleton />
        </>
      ) : (
        data?.data.map(file => {
          const fileName = file.file_type.split('/')
          const { formattedDate } = formatDate(file.created_at)
          let preview
          if (fileName[0] === 'image') {
            preview = (
              <img
                className="file-preview"
                src={file.url}
                alt={file.file_name}
              />
            )
          } else {
            preview = (
              <div className="file-preview">{file.file_name.slice(0, 2)}</div>
            )
          }
          return (
            <div className="attachment" key={file.id}>
              {preview}
              <p className="date">Added {formattedDate}</p>
              <p className="name">{file.file_name}</p>
              <div className="button-container">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = 'blob'
                    xhr.onload = function () {
                      const blob = xhr.response
                      const link = document.createElement('a')
                      link.href = URL.createObjectURL(blob)
                      link.download = file.file_name
                      link.click()
                      URL.revokeObjectURL(link.href)
                    }
                    xhr.open('GET', file.url)
                    xhr.send()
                  }}
                >
                  download
                </motion.button>
                <motion.button
                  title={
                    data.userId !== file.sender_id
                      ? 'only the file uploader can delete the file'
                      : ''
                  }
                  disabled={data.userId !== file.sender_id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (data.userId !== file.sender_id) return
                    handleDeleteFile({ taskId, customId: file.custom_id })
                  }}
                >
                  delete
                </motion.button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default Attachments
