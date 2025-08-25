import { Navigate } from "react-router-dom";
import { useAuthContext } from "./context/auth_context";

export default function ProtectedRoute({children}:{children:React.ReactNode}){
    const {user,authChecked}=useAuthContext();
    if (authChecked && !user){
        return (<Navigate to="/" replace />);
    }
    return (<>{children}</>);
}