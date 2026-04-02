/**
 * LoginPage.jsx — หน้าเข้าสู่ระบบ (mock)
 * What: ฟอร์มเลขประจำตัวประชาชนและรหัสผ่าน
 * Why: ตั้ง flag ใน localStorage แล้วไป /main — เมื่อเชื่อม backend ควรเรียก POST /api/tokens แล้วเก็บ JWT แทน
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

export function LoginPage() {
  const navigate = useNavigate()
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('todo_authed', '1')
    toast.success('เข้าสู่ระบบสำเร็จ')
    navigate('/main')
  }

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 112px)', sm: 'calc(100vh - 120px)' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.25} component="form" onSubmit={onSubmit}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  เข้าสู่ระบบ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  โปรดกรอกข้อมูลเพื่อใช้งาน To-Do
                </Typography>
              </Box>

              <TextField
                label="National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                autoComplete="username"
                inputMode="numeric"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Submit
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

