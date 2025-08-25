import { useState } from "react";
import { useMessageContext } from "../../../context/message_context";
import { useLoaderContext } from "../../../context/loader_context";
import { registerUser } from "../../../services/auth_service";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {

    const navigate=useNavigate();

    const {addNewMessage,addFormErrorMessage}=useMessageContext();
    const setLoading=useLoaderContext();

    const [formData,setFormData]=useState<{
        name:string
        email:string;
        password:string;
    }>({
        name:"",
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
        if (formData.name.trim().length<=0){
            addFormErrorMessage("Empty Name");
            return;
        }
        if (formData.email.trim().length<=0){
            addFormErrorMessage("Empty Email");
            return;
        }
        if (formData.password.trim().length<=0){
            addFormErrorMessage("Empty Password");
            return;
        }
        if (formData.name.trim().length>50){
            addFormErrorMessage("Name can be of maximum of 50 characters");
            return;
        }
        if (formData.password.trim().length<8){
            addFormErrorMessage("Password must be at least 8 characters long");
            return;
        }
        if (!(/[a-zA-Z]/.test(formData.password.trim()) && /\d/.test(formData.password.trim()))){
            addFormErrorMessage("Password must contain both letters and numbers");
            return;
        }
        setLoading(true);
        const res=await registerUser(formData.name.trim(),formData.email.trim(),formData.password.trim());
        if (res){
            navigate("/auth/login");
            addNewMessage("User created successfully. Please Login",{backgroundColor:"green"});
            setFormData({
                name:"",
                email:"",
                password:"",
            })
        }
        setLoading(false);
    }

    return (
        <>
            <h2 className="auth-title">Create Account</h2>
            <form className="auth-form">
                <div className="auth-form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Your name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="••••••••" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="button" onClick={handleSubmit} className="auth-button">Sign up</button>
            </form>

            <div className="auth-footer">
                Already have an account? <a href="/auth/login">Log in</a>
            </div>
        </>
    );
};

export default RegisterForm;
