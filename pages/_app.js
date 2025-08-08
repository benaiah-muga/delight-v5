import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </SettingsProvider>
  )
}

export default MyApp
