import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { storage } from '../../data/firebase'
import { deleteFile, fetchAttachments, uploadFile } from '../../utils/apis'
import formatDate from '../../utils/formatDate'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'
import FileSkeleton from '../../ui/FileSkeleton'

interface AttachmentsProps {
  taskId: number
}

const Attachments = function ({ taskId }: AttachmentsProps) {
  let toastId: string
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: uploadFile,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-attachments', taskId] })
    },
    onSettled() {
      toast.dismiss(toastId)
    },
  })
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
      })
    }

  return (
    <div className="attachments">
      <div className="description-header">
        <p>
          <img src="/description.svg" alt="attachments" />
          attachments
        </p>
        <label htmlFor="file-upload" className="edit-btn">
          <input onChange={handleUpload} type="file" id="file-upload" />
          <img src="/add.svg" alt="add" />
          add
        </label>
      </div>
      {isLoading ? (
        <>
          <FileSkeleton />
          <FileSkeleton />
        </>
      ) : (
        data?.map(file => {
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
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
