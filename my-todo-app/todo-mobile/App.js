import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from './src/navigation/AppNavigator'
import { appTheme } from './src/ui/design'

export default function App() {
  return (
    <PaperProvider theme={appTheme}>
      <AppNavigator />
    </PaperProvider>
  )
}
