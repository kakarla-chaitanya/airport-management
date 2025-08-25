import './auth_page.css';
import AuthBanner from './components/auth_banner';
import { Outlet } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <AuthBanner />
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;
