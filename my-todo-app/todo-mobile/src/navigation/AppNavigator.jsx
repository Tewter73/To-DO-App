import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import SignInScreen from '../screens/SignIn'
import RegisterScreen from '../screens/Register'
import ForgotPasswordScreen from '../screens/ForgotPassword'
import MainScreen from '../screens/Main'
import CreditScreen from '../screens/Credit'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function CustomDrawerContent(props) {
  const { onSignOut, firstName } = props
  return (
    <DrawerContentScrollView {...props}>
      {firstName ? <DrawerItem label={`ผู้ใช้งาน: ${firstName}`} disabled /> : null}
      <DrawerItem label="Main" onPress={() => props.navigation.navigate('Main')} />
      <DrawerItem label="Credit" onPress={() => props.navigation.navigate('Credit')} />
      <DrawerItem label="Sign Out" onPress={onSignOut} />
    </DrawerContentScrollView>
  )
}

function AppDrawer({ onSignOut, firstName }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onSignOut={onSignOut} firstName={firstName} />
      )}
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Drawer.Screen name="Main">
        {(props) => <MainScreen {...props} firstName={firstName} />}
      </Drawer.Screen>
      <Drawer.Screen name="Credit" component={CreditScreen} />
    </Drawer.Navigator>
  )
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const bootstrap = async () => {
      // Always require a fresh login when the app starts.
      await SecureStore.deleteItemAsync('token')
      await SecureStore.deleteItemAsync('firstName')
      setIsAuthed(false)
      setFirstName('')
      setIsLoading(false)
    }

    bootstrap()
  }, [])

  const handleSignInSuccess = (nextFirstName = '') => {
    setIsAuthed(true)
    setFirstName(nextFirstName)
  }

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('firstName')
    setIsAuthed(false)
    setFirstName('')
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthed ? (
          <Stack.Screen name="App">
            {(props) => <AppDrawer {...props} onSignOut={handleSignOut} firstName={firstName} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="SignIn">
              {(props) => <SignInScreen {...props} onSignInSuccess={handleSignInSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
