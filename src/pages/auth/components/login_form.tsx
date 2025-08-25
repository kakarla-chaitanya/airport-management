import { useState } from "react";
import { useMessageContext } from "../../../context/message_context";
import { useLoaderContext } from "../../../context/loader_context";
import { login } from "../../../services/auth_service";
import { useAuthContext } from "../../../context/auth_context";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

    const navigate=useNavigate();

    const {addNewMessage,addFormErrorMessage}=useMessageContext();
    const setLoading=useLoaderContext();
    const {setUser}=useAuthContext();

    const [formData,setFormData]=useState<{
        email:string;
        password:string;
    }>({
        email:"",
        password:""
    });

    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const {name,value}=e.target;
        setFormData((prev)=>({
            ...prev,
            [name]:value,
        }));
    }

    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        e.stopPropagation();
        if (formData.email.trim().length<=0){
            addFormErrorMessage("Empty Email");
            return;
        }
        if (formData.password.trim().length<=0){
            addFormErrorMessage("Empty Password");
            return;
        }
        setLoading(true);
        const user=await login(formData.email.trim(),formData.password.trim());
        if (user){
            setUser(user);
            navigate("/home");
            addNewMessage(`Welcome! ${user.name}`,{backgroundColor:"green"});
            setFormData({
                email:"",
                password:"",
            });
        }
        setLoading(false);
    }

    return (
        <>
            <h2 className="auth-title">Welcome Back</h2>
            <form className="auth-form">
                <div className="auth-form-group">
                    <label htmlFor="email">Username</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        placeholder="Enter your email" 
                        onChange={handleChange} 
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange} 
                        placeholder="••••••••" 
                    />
                </div>

                <button type="button" onClick={handleSubmit} className="auth-button">Log in</button>
            </form>

            <div className="auth-footer">
                Don't have an account? <a href="/auth/register">Sign up</a>
            </div>
        </>
    );
};

export default LoginForm;
