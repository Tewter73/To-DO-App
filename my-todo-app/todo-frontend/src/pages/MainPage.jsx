import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function formatDateTime(value) {
  if (!value) return ''
  return dayjs(value).format('DD/MM/YYYY HH:mm')
}

export function MainPage() {
  const initialTodos = useMemo(
    () => [
      {
        id: 't1',
        title: 'ส่งงานวิชา Frontend',
        datetime: dayjs('2026-04-01T21:00'),
      },
      {
        id: 't2',
        title: 'อ่านสรุปบทเรียน React Router',
        datetime: dayjs('2026-04-02T10:30'),
      },
      {
        id: 't3',
        title: 'ทำความสะอาดห้อง + จัดโต๊ะทำงาน',
        datetime: dayjs('2026-04-03T18:00'),
      },
    ],
    [],
  )

  const [todos, setTodos] = useState(initialTodos)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTask, setEditTask] = useState({ title: '', datetime: null })
  const [editTaskId, setEditTaskId] = useState(null)

  const onDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    toast.error('ลบสำเร็จ')
  }

  const handleEdit = (task) => {
    setEditTaskId(task.id)
    setEditTask({ title: task.title, datetime: task.datetime })
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditTaskId(null)
  }

  const saveEdit = () => {
    if (editTaskId) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editTaskId
            ? { ...t, title: editTask.title, datetime: editTask.datetime }
            : t,
        ),
      )
    }
    setIsEditDialogOpen(false)
    setEditTaskId(null)
    toast.success('บันทึกข้อมูลเรียบร้อย')
  }

  return (
    <Container maxWidth="md" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              รายการ To-Do
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Mockup) มี 3 รายการตัวอย่าง พร้อมปุ่ม Edit/Delete
            </Typography>
          </Box>

          <Stack spacing={2}>
            {todos.length === 0 ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography sx={{ fontWeight: 700 }}>
                    ไม่มีรายการคงเหลือ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ลองรีเฟรชหน้าเพื่อกลับไปเป็นรายการตัวอย่าง
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              todos.map((t) => (
                <Card key={t.id} variant="outlined">
                  <CardHeader
                    title={
                      <Typography sx={{ fontWeight: 900 }}>{t.title}</Typography>
                    }
                    subheader={formatDateTime(t.datetime)}
                    action={
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          aria-label="edit todo"
                          onClick={() => handleEdit(t)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete todo"
                          onClick={() => onDelete(t.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    }
                  />
                </Card>
              ))
            )}
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'text.primary' }}>
          แก้ไขรายการ To-Do
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Task Name"
            value={editTask.title}
            onChange={(e) =>
              setEditTask((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <MobileDateTimePicker
            label="วันเวลาที่บันทึก"
            value={editTask.datetime}
            onChange={(newValue) =>
              setEditTask((prev) => ({ ...prev, datetime: newValue }))
            }
            format="DD/MM/YYYY HH:mm"
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                variant: 'outlined',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" onClick={closeEditDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

