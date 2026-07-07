import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

export default function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
}
