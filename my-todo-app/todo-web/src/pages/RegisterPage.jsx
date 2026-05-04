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
  MenuItem,
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

const titleOptions = ['Mr.', 'Mrs.', 'Ms.']

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nationalId: '',
    title: '',
    firstName: '',
    lastName: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    password: validatePassword(form.password),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  const onChange = (key) => (event) => {
    let value = event.target.value
    if (key === 'nationalId' || key === 'password') {
      value = sanitizeNoSpaces(value)
    }
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!isFormValid) return

    try {
      setIsSubmitting(true)
      await api.post('/api/users', form)
      toast.success('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ')
      navigate('/login')
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error('NationalId นี้ถูกใช้งานแล้ว')
        return
      }

      toast.error('ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่')
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
                  สมัครสมาชิก
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  สร้างบัญชีเพื่อใช้งานระบบ To-Do
                </Typography>
              </Box>

              <TextField
                label="National ID"
                value={form.nationalId}
                onChange={onChange('nationalId')}
                required
                fullWidth
                error={form.nationalId !== '' && !!errors.nationalId}
                helperText={form.nationalId !== '' ? errors.nationalId : ''}
              />
              <TextField
                select
                label="Title"
                value={form.title}
                onChange={onChange('title')}
                fullWidth
              >
                {titleOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={onChange('firstName')}
                required
                fullWidth
                error={form.firstName !== '' && !!errors.firstName}
                helperText={form.firstName !== '' ? errors.firstName : ''}
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={onChange('lastName')}
                required
                fullWidth
                error={form.lastName !== '' && !!errors.lastName}
                helperText={form.lastName !== '' ? errors.lastName : ''}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange('password')}
                required
                fullWidth
                error={form.password !== '' && !!errors.password}
                helperText={form.password !== '' ? errors.password : ''}
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
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>

              <Typography variant="body2">
                มีบัญชีแล้ว?{' '}
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

