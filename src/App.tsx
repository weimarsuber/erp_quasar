import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {isAuthenticated ? (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}