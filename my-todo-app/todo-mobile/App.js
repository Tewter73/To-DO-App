import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from './src/navigation/AppNavigator'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2',    // Web App MUI Primary Blue
    background: '#f5f7fb', // Web App background
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: '#ffffff',   // Keep cards white
    }
  },
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  )
}
