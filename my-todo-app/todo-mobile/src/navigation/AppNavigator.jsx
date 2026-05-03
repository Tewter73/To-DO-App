import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Avatar, Divider, Text } from 'react-native-paper'
import SignInScreen from '../screens/SignIn'
import RegisterScreen from '../screens/Register'
import ForgotPasswordScreen from '../screens/ForgotPassword'
import MainScreen from '../screens/Main'
import CreditScreen from '../screens/Credit'
import { palette } from '../ui/design'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    primary: palette.primary,
    card: '#FFFFFF',
    text: palette.textPrimary,
    border: palette.border,
  },
}

function CustomDrawerContent(props) {
  const { onSignOut, firstName } = props
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={{ padding: 20, backgroundColor: '#FFFFFF' }}>
        <Avatar.Text
          size={46}
          label={(firstName?.slice(0, 1) || 'U').toUpperCase()}
          style={{ backgroundColor: '#E2E8F0', marginBottom: 10 }}
          color={palette.textPrimary}
        />
        <Text variant="titleMedium" style={{ color: palette.textPrimary, fontWeight: '700' }}>
          {firstName ? firstName : 'ผู้ใช้งาน'}
        </Text>
        <Text variant="bodySmall" style={{ color: palette.textSecondary, marginTop: 4 }}>
          To-Do Workspace
        </Text>
      </View>
      <View style={{ paddingTop: 10 }}>
        <DrawerItem label="Dashboard" onPress={() => props.navigation.navigate('Main')} />
        <DrawerItem label="About Team" onPress={() => props.navigation.navigate('Credit')} />
        <Divider style={{ marginVertical: 6 }} />
        <DrawerItem label="Sign Out" onPress={onSignOut} />
      </View>
    </DrawerContentScrollView>
  )
}

function AppDrawer({ firstName, onSignOut }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onSignOut={onSignOut} firstName={firstName} />
      )}
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#FFFFFF' },
        sceneStyle: { backgroundColor: palette.background },
        drawerStyle: { backgroundColor: '#FFFFFF' },
        drawerActiveTintColor: palette.textPrimary,
        drawerInactiveTintColor: palette.textPrimary,
        drawerActiveBackgroundColor: '#E2E8F0',
        drawerInactiveBackgroundColor: 'transparent',
      }}
    >
      <Drawer.Screen name="Main" options={{ title: 'Task Dashboard' }}>
        {(props) => <MainScreen {...props} firstName={firstName} />}
      </Drawer.Screen>
      <Drawer.Screen name="Credit" component={CreditScreen} options={{ title: 'Team Credits' }} />
    </Drawer.Navigator>
  )
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const bootstrap = async () => {
      // Always require a fresh login when the app starts.
      await SecureStore.deleteItemAsync('token')
      await SecureStore.deleteItemAsync('firstName')
      setFirstName('')
      setIsLoading(false)
    }

    bootstrap()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn">
          {(props) => (
            <SignInScreen
              {...props}
              onSignInSuccess={(name) => setFirstName(name ?? '')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="MainDrawer">
          {(stackProps) => (
            <AppDrawer
              firstName={firstName}
              onSignOut={async () => {
                await SecureStore.deleteItemAsync('token')
                await SecureStore.deleteItemAsync('firstName')
                setFirstName('')
                stackProps.navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                })
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
