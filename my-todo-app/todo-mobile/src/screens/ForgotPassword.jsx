import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { Button, Card, TextInput, Title, Text } from 'react-native-paper'
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
  const [submitted, setSubmitted] = useState(false)

  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    newPassword: validatePassword(form.newPassword),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  const displayError = (key) => {
    if (submitted) return errors[key]
    if (form[key]) return errors[key]
    return ''
  }

  const onChange = (key) => (value) => {
    const nextValue =
      key === 'nationalId' || key === 'newPassword' ? sanitizeNoSpaces(value) : value
    setForm((prev) => ({ ...prev, [key]: nextValue }))
  }

  const onSubmit = async () => {
    setSubmitted(true)
    if (!isFormValid) {
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

  const LabelError = ({ error }) => {
    if (!error) return null;
    return <Text style={{ color: '#b22222', fontSize: 12, marginBottom: 4, marginLeft: 4 }}>{error}</Text>;
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ marginVertical: 20 }}>
          <Card.Content>
            <Title style={{ marginBottom: 16 }}>Reset Password</Title>

            <LabelError error={displayError('nationalId')} />
            <TextInput
              label="เลขประจำตัวประชาชน"
              error={!!displayError('nationalId')}
              mode="outlined"
              value={form.nationalId}
              onChangeText={onChange('nationalId')}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 12 }}
            />

            <LabelError error={displayError('firstName')} />
            <TextInput
              label="ชื่อจริง"
              error={!!displayError('firstName')}
              mode="outlined"
              value={form.firstName}
              onChangeText={onChange('firstName')}
              style={{ marginBottom: 12 }}
            />

            <LabelError error={displayError('lastName')} />
            <TextInput
              label="นามสกุล"
              error={!!displayError('lastName')}
              mode="outlined"
              value={form.lastName}
              onChangeText={onChange('lastName')}
              style={{ marginBottom: 12 }}
            />

            <LabelError error={displayError('newPassword')} />
            <TextInput
              label="รหัสผ่านใหม่"
              error={!!displayError('newPassword')}
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

            <Button mode="contained" onPress={onSubmit} loading={loading} style={{ marginTop: 8 }}>
              บันทึกรหัสผ่านใหม่
            </Button>
            <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
              กลับไปหน้า Login
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
