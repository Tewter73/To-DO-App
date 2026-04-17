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

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nationalId: '',
    title: '',
    firstName: '',
    lastName: '',
    password: '',
  })
  const [secureText, setSecureText] = useState(true)
  const [loading, setLoading] = useState(false)
  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    password: validatePassword(form.password),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  const onChange = (key) => (value) => {
    const nextValue =
      key === 'nationalId' || key === 'password' ? sanitizeNoSpaces(value) : value
    setForm((prev) => ({ ...prev, [key]: nextValue }))
  }

  const onSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/users/register', {
        nationalId: form.nationalId,
        title: form.title.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
      })
      Alert.alert('สำเร็จ', 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ', [
        { text: 'ตกลง', onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      if (error?.response?.status === 409) {
        Alert.alert('สมัครไม่สำเร็จ', 'National ID นี้ถูกใช้งานแล้ว')
      } else {
        Alert.alert('สมัครไม่สำเร็จ', 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
      <Card>
        <Card.Content>
          <Title style={{ marginBottom: 16 }}>Register</Title>
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
            label="คำนำหน้า (Mr./Mrs./Ms.)"
            mode="outlined"
            value={form.title}
            onChangeText={onChange('title')}
            style={{ marginBottom: 12 }}
          />
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
            label="รหัสผ่าน"
            mode="outlined"
            value={form.password}
            onChangeText={onChange('password')}
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
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>
          <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading || !isFormValid}>
            สมัครสมาชิก
          </Button>
          <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
            กลับไปหน้า Login
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}
