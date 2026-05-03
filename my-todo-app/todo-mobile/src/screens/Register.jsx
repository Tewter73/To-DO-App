import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { Button, Card, TextInput, Title, SegmentedButtons, Text } from 'react-native-paper'
import api from '../api'
import {
  sanitizeNoSpaces,
  validateNationalId,
  validatePassword,
  validatePersonName,
} from '../utils/validation'
import { layout, palette, shadows } from '../ui/design'

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nationalId: '',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    password: '',
  })
  const [secureText, setSecureText] = useState(true)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const errors = {
    nationalId: validateNationalId(form.nationalId),
    firstName: validatePersonName(form.firstName, 'ชื่อ'),
    lastName: validatePersonName(form.lastName, 'นามสกุล'),
    password: validatePassword(form.password),
  }
  
  const isFormValid = Object.values(errors).every((value) => !value) && form.title !== ''

  const displayError = (key) => {
    if (submitted) return errors[key]
    if (form[key]) return errors[key]
    return ''
  }

  const onChange = (key) => (value) => {
    const nextValue =
      key === 'nationalId' || key === 'password' ? sanitizeNoSpaces(value) : value
    setForm((prev) => ({ ...prev, [key]: nextValue }))
  }

  const onSubmit = async () => {
    setSubmitted(true)
    if (!isFormValid) {
      Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลสมัครสมาชิกให้ครบและถูกต้อง')
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
        contentContainerStyle={{ flexGrow: 1, padding: layout.pagePadding, backgroundColor: palette.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 24, marginTop: 12, paddingHorizontal: 4 }}>
          <Text variant="displaySmall" style={{ fontWeight: '900', color: palette.primary }}>
            Create account
          </Text>
          <Text variant="titleMedium" style={{ marginTop: 8, color: palette.textSecondary }}>
            Register your profile to start tracking tasks with your team.
          </Text>
        </View>

        <Card style={{ marginVertical: 8, borderRadius: layout.cardRadius, backgroundColor: palette.surface, ...shadows.medium }}>
          <Card.Content style={{ padding: 20 }}>
            <Title style={{ marginBottom: 16 }}>Register</Title>

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
              style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }}
            />

            <View style={{ marginBottom: 16, marginTop: 4 }}>
              <Text variant="titleSmall" style={{ marginBottom: 8, color: palette.textSecondary }}>คำนำหน้าชื่อ</Text>
              <SegmentedButtons
                value={form.title}
                onValueChange={onChange('title')}
                buttons={[
                  { value: 'Mr.', label: 'Mr.' },
                  { value: 'Mrs.', label: 'Mrs.' },
                  { value: 'Ms.', label: 'Ms.' },
                ]}
              />
            </View>

            <LabelError error={displayError('firstName')} />
            <TextInput
              label="ชื่อจริง"
              error={!!displayError('firstName')}
              mode="outlined"
              value={form.firstName}
              onChangeText={onChange('firstName')}
              style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }}
            />

            <LabelError error={displayError('lastName')} />
            <TextInput
              label="นามสกุล"
              error={!!displayError('lastName')}
              mode="outlined"
              value={form.lastName}
              onChangeText={onChange('lastName')}
              style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }}
            />

            <LabelError error={displayError('password')} />
            <TextInput
              label="รหัสผ่าน"
              error={!!displayError('password')}
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
              style={{ marginBottom: 16, backgroundColor: '#FFFFFF' }}
            />

            <Button mode="contained" onPress={onSubmit} loading={loading} style={{ marginTop: 16, borderRadius: 12 }} contentStyle={{ paddingVertical: 8 }} labelStyle={{ fontSize: 16, fontWeight: '700' }}>
              Create Account
            </Button>
            <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
              Back to Sign In
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
