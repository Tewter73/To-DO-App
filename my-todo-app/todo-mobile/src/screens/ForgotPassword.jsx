import { useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { Button, Card, HelperText, TextInput, Title } from 'react-native-paper'
import api from '../api'
import {
  sanitizeNoSpaces,
  validateNationalId,
  validatePassword,
  validatePersonName,
} from '../utils/validation'

export default function ForgotPasswordScreen({ navigation }) {
  const [form, setForm] = useState({
    nationalId: '',
    firstName: '',
    lastName: '',
    newPassword: '',
  })
  const [secureText, setSecureText] = useState(true)
  const [loading, setLoading] = useState(false)
  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    newPassword: validatePassword(form.newPassword),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  const onChange = (key) => (value) => {
    const nextValue =
      key === 'nationalId' || key === 'newPassword' ? sanitizeNoSpaces(value) : value
    setForm((prev) => ({ ...prev, [key]: nextValue }))
  }

  const onSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/users/reset-password', {
        nationalId: form.nationalId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        newPassword: form.newPassword,
      })
      Alert.alert('สำเร็จ', 'รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่', [
        { text: 'ตกลง', onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      if (error?.response?.status === 404) {
        Alert.alert('ไม่พบข้อมูล', 'ไม่พบผู้ใช้ตามข้อมูลที่ระบุ')
      } else {
        Alert.alert('ไม่สำเร็จ', 'ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
      <Card>
        <Card.Content>
          <Title style={{ marginBottom: 16 }}>Reset Password</Title>
          <TextInput
            label="เลขประจำตัวประชาชน"
            mode="outlined"
            value={form.nationalId}
            onChangeText={onChange('nationalId')}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ marginBottom: 12 }}
          />
          <HelperText type="error" visible={!!errors.nationalId}>
            {errors.nationalId}
          </HelperText>
          <TextInput
            label="ชื่อจริง"
            mode="outlined"
            value={form.firstName}
            onChangeText={onChange('firstName')}
            style={{ marginBottom: 12 }}
          />
          <HelperText type="error" visible={!!errors.firstName}>
            {errors.firstName}
          </HelperText>
          <TextInput
            label="นามสกุล"
            mode="outlined"
            value={form.lastName}
            onChangeText={onChange('lastName')}
            style={{ marginBottom: 12 }}
          />
          <HelperText type="error" visible={!!errors.lastName}>
            {errors.lastName}
          </HelperText>
          <TextInput
            label="รหัสผ่านใหม่"
            mode="outlined"
            value={form.newPassword}
            onChangeText={onChange('newPassword')}
            secureTextEntry={secureText}
            autoCapitalize="none"
            autoCorrect={false}
            right={
              <TextInput.Icon
                icon={secureText ? 'eye' : 'eye-off'}
                onPress={() => setSecureText((prev) => !prev)}
              />
            }
            style={{ marginBottom: 16 }}
          />
          <HelperText type="error" visible={!!errors.newPassword}>
            {errors.newPassword}
          </HelperText>
          <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading || !isFormValid}>
            บันทึกรหัสผ่านใหม่
          </Button>
          <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
            กลับไปหน้า Login
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}
