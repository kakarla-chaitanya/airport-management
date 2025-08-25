import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./styles/side_bar.css";
import { useFloatingslidePanelContext } from "../../../context/floating_slide_panel_context";
import { MdLogout } from 'react-icons/md';
import AddUserForm from '../pages/add user/add_user-form';
import { useLoaderContext } from '../../../context/loader_context';
import { useMessageContext } from '../../../context/message_context';
import { logout } from '../../../services/auth_service';
import { useAuthContext } from '../../../context/auth_context';
import { Roles } from '../../../models/roles';

const Sidebar = () => {

  const setLoading=useLoaderContext();
  const {addNewMessage}=useMessageContext();
  const {setUser,user}=useAuthContext();

  const navigate=useNavigate();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { setOpen: openPanel, setChild } = useFloatingslidePanelContext();

  const toggleSidebar = () => setOpen(prev => !prev);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setOpen(false);
  };

  const handleAddUserClick = () => {
    setChild(<AddUserForm onCancel={()=>{
      openPanel(false);
      setChild(null);
    }}/>);
    openPanel(true);
    if (isMobile) setOpen(false);
  };

  async function handleLogout(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res=await logout();
    if(res){
      setUser(null);
      navigate("/");
      addNewMessage("Logged-Out successfully",{backgroundColor:"green"});
    }
    setLoading(false);
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {user
          &&
          <div className="sidebar-header">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">
              {user.role }
            </div>
          </div>
        }

        <nav className="sidebar-nav">
          <NavLink to="/home/dashboard" onClick={handleNavClick}>Dashboard</NavLink>
          <NavLink to="/home/flights" onClick={handleNavClick}>Flights</NavLink>
          <NavLink to="/home/baggage" onClick={handleNavClick}>Baggage</NavLink>
          {(user?.role===Roles.admin || user?.role===Roles.airlineStaff)
            &&
            <NavLink to="/home/operations" onClick={handleNavClick}>Ops</NavLink>
          }
          {(user?.role===Roles.admin) 
            && 
            <button className="sidebar-link-button" onClick={handleAddUserClick}>Add User</button>
          }
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <MdLogout size={20} style={{ marginRight: "8px" }} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
