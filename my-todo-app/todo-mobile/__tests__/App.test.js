import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import SignInScreen from '../src/screens/SignIn'
import RegisterScreen from '../src/screens/Register'
import MainScreen from '../src/screens/Main'
import api from '../src/api'
import * as SecureStore from 'expo-secure-store'

jest.mock('../src/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

function renderWithProvider(ui) {
  return render(<PaperProvider>{ui}</PaperProvider>)
}

describe('Mobile validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows LabelError on invalid Login input and prevents submit', () => {
    const { getByText, getAllByTestId, getByRole } = renderWithProvider(
      <SignInScreen onSignInSuccess={jest.fn()} navigation={{ navigate: jest.fn() }} />,
    )

    const inputs = getAllByTestId('text-input-outlined')
    fireEvent.changeText(inputs[0], '123')
    fireEvent.changeText(inputs[1], 'abc 123')

    expect(getByText('เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')).toBeTruthy()
    expect(getByText('รหัสผ่านต้องอย่างน้อย 8 ตัว และห้ามมีช่องว่าง')).toBeTruthy()
    
    // Simulate submit
    fireEvent.press(getByRole('button', { name: 'Sign In' }))
    // api should not be called
    expect(api.post).not.toHaveBeenCalled()
  })

  test('shows LabelError on invalid Register input and prevents submit', () => {
    const { getByText, getAllByTestId, getByRole } = renderWithProvider(
      <RegisterScreen navigation={{ goBack: jest.fn() }} />,
    )

    const inputs = getAllByTestId('text-input-outlined')
    fireEvent.changeText(inputs[0], '123')
    fireEvent.changeText(inputs[1], 'A')
    fireEvent.changeText(inputs[2], 'B')
    fireEvent.changeText(inputs[3], '123 45')

    expect(getByText('เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')).toBeTruthy()
    expect(getByText('ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')).toBeTruthy()
    expect(getByText('นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร')).toBeTruthy()
    
    // Simulate submit
    fireEvent.press(getByRole('button', { name: 'Create Account' }))
    // api should not be called
    expect(api.post).not.toHaveBeenCalled()
  })
})

describe('Mobile API and storage interaction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('successful login stores token and navigates to app state', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt-token', firstName: 'Kunanon' },
    })
    const onSignInSuccess = jest.fn()

    const { getAllByTestId, getByRole } = renderWithProvider(
      <SignInScreen onSignInSuccess={onSignInSuccess} navigation={{ navigate: jest.fn() }} />,
    )

    const inputs = getAllByTestId('text-input-outlined')
    fireEvent.changeText(inputs[0], '1234567890123')
    fireEvent.changeText(inputs[1], 'password123')
    fireEvent.press(getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'jwt-token')
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('firstName', 'Kunanon')
      expect(onSignInSuccess).toHaveBeenCalledWith('Kunanon')
    })
  })

  test('Main screen fetches and renders activities list', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, name: 'Buy milk', when: '2026-04-17T09:30:00' }],
    })

    const { getByText } = renderWithProvider(<MainScreen firstName="Kunanon" />)

    await waitFor(() => {
      expect(getByText('Buy milk')).toBeTruthy()
    })
  })
})
