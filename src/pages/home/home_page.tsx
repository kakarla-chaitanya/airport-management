import { Outlet } from 'react-router-dom';
import Sidebar from './components/side_bar';
import "./home_page.css";
import { FloatingSlidePanelProvider } from '../../context/floating_slide_panel_context';

const HomePage = () => {
  return (
    <FloatingSlidePanelProvider>
      <div className='home-page'>
        <Sidebar />
        <main  className="home-main">
          <Outlet />
        </main>
      </div>
    </FloatingSlidePanelProvider>
  );
};
export default HomePage;