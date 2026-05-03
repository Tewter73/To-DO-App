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
import { setAuthToken, setFirstName } from '../lib/auth.js'
import {
  sanitizeNoSpaces,
  validateNationalId,
  validatePassword,
} from '../utils/validation.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nationalIdError = validateNationalId(nationalId)
  const passwordError = validatePassword(password)
  const isFormValid = !nationalIdError && !passwordError

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    try {
      setIsSubmitting(true)
      const { data } = await api.post('/api/tokens', {
        nationalId,
        password,
      })

      setAuthToken(data.token)
      setFirstName(data.firstName)
      toast.success('เข้าสู่ระบบสำเร็จ')
      navigate('/main')
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('NationalId หรือ Password ไม่ถูกต้อง')
        return
      }

      toast.error('ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
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
                onChange={(e) => setNationalId(sanitizeNoSpaces(e.target.value))}
                autoComplete="username"
                inputMode="numeric"
                fullWidth
                required
                error={!!nationalIdError}
                helperText={nationalIdError}
                sx={{
                  '& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.Mui-error': {
                    color: 'rgba(0, 0, 0, 0.45)',
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(sanitizeNoSpaces(e.target.value))}
                autoComplete="current-password"
                fullWidth
                required
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  '& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.Mui-error': {
                    color: 'rgba(0, 0, 0, 0.45)',
                  },
                }}
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
                fullWidth
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <Stack direction="row" justifyContent="space-between">
                <Link component={RouterLink} to="/register" underline="hover">
                  สมัครสมาชิก
                </Link>
                <Link component={RouterLink} to="/forgot-password" underline="hover">
                  ลืมรหัสผ่าน
                </Link>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

