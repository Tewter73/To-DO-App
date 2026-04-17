import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { api } from '../lib/api.js'
import {
  sanitizeNoSpaces,
  validateNationalId,
  validatePassword,
  validatePersonName,
} from '../utils/validation.js'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nationalId: '',
    firstName: '',
    lastName: '',
    newPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    newPassword: validatePassword(form.newPassword),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  const onChange = (key) => (event) => {
    let value = event.target.value
    if (key === 'nationalId' || key === 'newPassword') {
      value = sanitizeNoSpaces(value)
    }
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!isFormValid) return

    try {
      setIsSubmitting(true)
      await api.post('/api/users/reset-password', form)
      toast.success('รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่')
      navigate('/login')
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error('ไม่พบข้อมูลผู้ใช้ตามที่ระบุ')
        return
      }

      toast.error('ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 112px)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.25} component="form" onSubmit={onSubmit}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  ตั้งรหัสผ่านใหม่
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ยืนยันตัวตนด้วย National ID และชื่อ-นามสกุล
                </Typography>
              </Box>

              <TextField
                label="National ID"
                value={form.nationalId}
                onChange={onChange('nationalId')}
                required
                fullWidth
                error={!!errors.nationalId}
                helperText={errors.nationalId}
              />
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={onChange('firstName')}
                required
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={onChange('lastName')}
                required
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={form.newPassword}
                onChange={onChange('newPassword')}
                required
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? 'Updating...' : 'Reset Password'}
              </Button>

              <Typography variant="body2">
                <Link component={RouterLink} to="/login" underline="hover">
                  กลับไปหน้า Login
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

