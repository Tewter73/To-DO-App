import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { api } from '../lib/api.js'
import { clearAuthToken } from '../lib/auth.js'
import { validateActivityName } from '../utils/validation.js'

function formatDateTime(value) {
  if (!value) return ''
  return dayjs(value).format('DD/MM/YYYY HH:mm')
}

function toLocalApiDateTime(value) {
  if (!value) return null
  return dayjs(value).format('YYYY-MM-DDTHH:mm:ss')
}

export function MainPage() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskWhen, setNewTaskWhen] = useState(dayjs())
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTask, setEditTask] = useState({ title: '', datetime: null })
  const [editTaskId, setEditTaskId] = useState(null)
  const newTaskNameError = validateActivityName(newTaskName)
  const editTaskNameError = validateActivityName(editTask.title)

  const normalizedTodos = useMemo(
    () =>
      todos.map((item) => ({
        id: item.id,
        title: item.name,
        datetime: dayjs(item.when),
      })),
    [todos],
  )

  const handleAuthError = () => {
    clearAuthToken()
    toast.error('Token หมดอายุ กรุณาเข้าสู่ระบบใหม่')
    navigate('/login')
  }

  const loadActivities = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/activities')
      setTodos(data)
    } catch (error) {
      if (error?.response?.status === 401) {
        handleAuthError()
        return
      }

      toast.error('ไม่สามารถดึงรายการงานได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const onCreate = async () => {
    if (newTaskNameError) {
      toast.error(newTaskNameError)
      return
    }

    try {
      await api.post('/api/activities', {
        name: newTaskName.trim(),
        when: toLocalApiDateTime(newTaskWhen),
      })
      await loadActivities()
      setNewTaskName('')
      setNewTaskWhen(dayjs())
      toast.success('เพิ่มงานสำเร็จ')
    } catch (error) {
      if (error?.response?.status === 401) {
        handleAuthError()
        return
      }

      toast.error('ไม่สามารถเพิ่มงานได้')
    }
  }

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/activities/${id}`)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      toast.success('ลบงานสำเร็จ')
    } catch (error) {
      if (error?.response?.status === 401) {
        handleAuthError()
        return
      }

      toast.error('ไม่สามารถลบงานได้')
    }
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

  const saveEdit = async () => {
    if (!editTaskId || !editTask.datetime || editTaskNameError) {
      toast.error('ข้อมูลที่จะแก้ไขไม่ครบถ้วน')
      return
    }

    try {
      await api.put(`/api/activities/${editTaskId}`, {
        name: editTask.title.trim(),
        when: toLocalApiDateTime(editTask.datetime),
      })
      await loadActivities()
      setIsEditDialogOpen(false)
      setEditTaskId(null)
      toast.success('อัปเดตงานสำเร็จ')
    } catch (error) {
      if (error?.response?.status === 401) {
        handleAuthError()
        return
      }

      toast.error('ไม่สามารถแก้ไขงานได้')
    }
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
              เชื่อมข้อมูลจริงจาก API: เพิ่ม แก้ไข ลบ และโหลดจากฐานข้อมูล
            </Typography>
          </Box>

          <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700 }}>เพิ่มงานใหม่</Typography>
              <TextField
                label="Task Name"
                value={newTaskName}
                onChange={(event) => setNewTaskName(event.target.value)}
                fullWidth
                error={!!newTaskNameError}
                helperText={newTaskNameError}
              />
              <MobileDateTimePicker
                label="วันที่และเวลา"
                value={newTaskWhen}
                onChange={(value) => setNewTaskWhen(value ?? dayjs())}
                ampm={false}
                format="DD/MM/YYYY HH:mm"
                slotProps={{ textField: { fullWidth: true } }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreate}
                disabled={!!newTaskNameError}
              >
                เพิ่มงาน
              </Button>
            </Stack>
          </Paper>

          <Divider />

          <Stack spacing={2}>
            {!loading && normalizedTodos.length === 0 ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography sx={{ fontWeight: 700 }}>
                    ไม่มีรายการคงเหลือ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ลองเพิ่มงานแรกของคุณด้านบน
                  </Typography>
                </CardContent>
              </Card>
            ) : null}

            {loading ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography>กำลังโหลดข้อมูล...</Typography>
                </CardContent>
              </Card>
            ) : (
              normalizedTodos.map((t) => (
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
            required
            error={!!editTaskNameError}
            helperText={editTaskNameError}
          />
          <MobileDateTimePicker
            label="วันเวลาที่บันทึก"
            value={editTask.datetime}
            onChange={(newValue) =>
              setEditTask((prev) => ({ ...prev, datetime: newValue }))
            }
            ampm={false}
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
          <Button variant="contained" onClick={saveEdit} disabled={!!editTaskNameError}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

