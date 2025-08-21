import { Outlet } from 'react-router-dom';
import Sidebar from './components/side_bar';
import "./home_page.css";

const HomePage = () => {
  return (
    <div className='home-page'>
      <Sidebar />
      <main  className="home-main">
        <Outlet />
      </main>
    </div>
  );
};
export default HomePage;