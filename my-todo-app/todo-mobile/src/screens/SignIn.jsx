import { useState } from 'react'
import { Alert, View } from 'react-native'
import { Button, Card, HelperText, Text, TextInput, Title } from 'react-native-paper'
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
  const nationalIdError = validateNationalId(nationalId)
  const passwordError = validatePassword(password)
  const isFormValid = !nationalIdError && !passwordError

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกเลขประจำตัวประชาชนและรหัสผ่าน')
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Card>
        <Card.Content>
          <Title style={{ marginBottom: 16 }}>Sign In</Title>
          <TextInput
            label="เลขประจำตัวประชาชน"
            mode="outlined"
            value={nationalId}
            onChangeText={(value) => setNationalId(sanitizeNoSpaces(value))}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ marginBottom: 12 }}
          />
          <HelperText type="error" visible={!!nationalIdError}>
            {nationalIdError}
          </HelperText>
          <TextInput
            label="รหัสผ่าน"
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
          <HelperText type="error" visible={!!passwordError}>
            {passwordError}
          </HelperText>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !isFormValid}
          >
            Submit
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: 8 }}
          >
            สมัครสมาชิก
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')}>
            ลืมรหัสผ่าน
          </Button>
          <Text variant="bodySmall" style={{ marginTop: 4, textAlign: 'center' }}>
            ยังไม่มีบัญชี? กดสมัครสมาชิกได้ทันที
          </Text>
        </Card.Content>
      </Card>
    </View>
  )
}
