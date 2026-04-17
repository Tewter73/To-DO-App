import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { Button, Card, Text, TextInput, Title } from 'react-native-paper'
import * as SecureStore from 'expo-secure-store'
import api from '../api'
import {
  sanitizeNoSpaces,
  validateNationalId,
  validatePassword,
} from '../utils/validation'

export default function SignInScreen({ onSignInSuccess, navigation }) {
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [secureText, setSecureText] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  
  const nationalIdError = validateNationalId(nationalId)
  const passwordError = validatePassword(password)
  const isFormValid = !nationalIdError && !passwordError

  const displayError = (error, value) => {
    if (submitted) return error;
    if (value) return error;
    return '';
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!isFormValid) {
      return
    }

    try {
      setLoading(true)
      const { data } = await api.post('/api/tokens', {
        nationalId,
        password,
      })

      await SecureStore.setItemAsync('token', data.token)
      await SecureStore.setItemAsync('firstName', data.firstName ?? '')
      onSignInSuccess(data.firstName ?? '')
    } catch (error) {
      Alert.alert('Login Failed', 'เลขประจำตัวประชาชนหรือรหัสผ่านไม่ถูกต้อง')
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
        contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ marginVertical: 20 }}>
          <Card.Content>
            <Title style={{ marginBottom: 16 }}>Sign In</Title>

            <LabelError error={displayError(nationalIdError, nationalId)} />
            <TextInput
              label="เลขประจำตัวประชาชน"
              error={!!displayError(nationalIdError, nationalId)}
              mode="outlined"
              value={nationalId}
              onChangeText={(value) => setNationalId(sanitizeNoSpaces(value))}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 12 }}
            />

            <LabelError error={displayError(passwordError, password)} />
            <TextInput
              label="รหัสผ่าน"
              error={!!displayError(passwordError, password)}
              mode="outlined"
              value={password}
              onChangeText={(value) => setPassword(sanitizeNoSpaces(value))}
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

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Submit
            </Button>
            <Text variant="bodySmall" style={{ marginTop: 16, textAlign: 'center' }}>
              ยังไม่มีบัญชี? กดสมัครสมาชิกได้ทันที
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={{ marginTop: 4 }}
            >
              สมัครสมาชิก
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')}>
              ลืมรหัสผ่าน
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
