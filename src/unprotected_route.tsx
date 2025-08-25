import { Navigate } from "react-router-dom";
import { useAuthContext } from "./context/auth_context";

export default function UnprotectedRoute({children}:{children:React.ReactNode}){
    const {user,authChecked}=useAuthContext();
    if (authChecked && user){
        return (<Navigate to="/home" replace />);
    }
    return (<>{children}</>);
}