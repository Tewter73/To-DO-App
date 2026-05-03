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
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTask, setEditTask] = useState({ title: '', datetime: null })
  const [editTaskId, setEditTaskId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
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

  const filteredTodos = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return normalizedTodos
    return normalizedTodos.filter((item) => item.title.toLowerCase().includes(keyword))
  }, [normalizedTodos, searchTerm])

  const handleAuthError = () => {
    clearAuthToken()
    toast.error('Token หมดอายุ กรุณาเข้าสู่ระบบใหม่')
    navigate('/login')
  }

  const loadActivities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/activities')
      const { data, status } = response
      if (status === 204 || data == null || data === '') {
        setTodos([])
      } else {
        setTodos(Array.isArray(data) ? data : [])
      }
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

  const openDeleteDialog = (id) => {
    setDeleteTaskId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setDeleteTaskId(null)
  }

  const confirmDelete = async () => {
    if (deleteTaskId == null) {
      return
    }

    const id = deleteTaskId

    try {
      await api.delete(`/api/activities/${id}`)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      toast.success('ลบงานสำเร็จ')
      closeDeleteDialog()
    } catch (error) {
      if (error?.response?.status === 401) {
        handleAuthError()
        closeDeleteDialog()
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

          <Paper sx={{ p: 2, borderRadius: 1 }}>
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

          <Paper sx={{ p: 2, borderRadius: 1 }}>
            <TextField
              label="Search task"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
            />
          </Paper>

          <Divider />

          <Stack spacing={2}>
            {!loading && normalizedTodos.length === 0 ? (
              <Card variant="outlined" sx={{ borderRadius: 1 }}>
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
            {!loading && normalizedTodos.length > 0 && filteredTodos.length === 0 ? (
              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 700 }}>
                    ไม่พบงานที่ตรงกับคำค้นหา
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ลองเปลี่ยนคำค้นหาหรือล้างช่องค้นหา
                  </Typography>
                </CardContent>
              </Card>
            ) : null}

            {loading ? (
              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Typography>กำลังโหลดข้อมูล...</Typography>
                </CardContent>
              </Card>
            ) : (
              filteredTodos.map((t) => (
                <Card key={t.id} variant="outlined" sx={{ borderRadius: 1 }}>
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
                          onClick={() => openDeleteDialog(t.id)}
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
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'text.primary' }}>
          ยืนยันการลบ
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ยืนยันการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0 } }}
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

