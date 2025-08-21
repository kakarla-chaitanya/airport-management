import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import AuthPage from './pages/auth/auth_page';
import LoginForm from './pages/auth/components/login_form';
import RegisterForm from './pages/auth/components/register_form';
import { LoaderProvider } from './context/loader_context';
import HomePage from './pages/home/home_page';
import DashboardPage from './pages/home/pages/dashboard/dashboard_page';
import FlightPage from './pages/home/pages/flights/flight_page';
import BaggagePage from './pages/home/pages/baggage/baggage_page';
import OperationPage from './pages/home/pages/operations/operation_page';

function App() {
  return <>
    <LoaderProvider>
      <Routes>
        <Route path='/' element={<Navigate to="/auth"/>} />
        <Route path='/auth/*' element={<AuthPage/>}>
          <Route index element={<Navigate to="login"/>} />
          <Route path='login' element={<LoginForm />} />
          <Route path='register' element={<RegisterForm />} />
        </Route>
        <Route path="/home" element={<HomePage />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='flights' element={<FlightPage />} />
          <Route path='baggage' element={<BaggagePage />} />
          <Route path='operations' element={<OperationPage />} />
        </Route>
      </Routes>
    </LoaderProvider>
  </>;
}

export default App
