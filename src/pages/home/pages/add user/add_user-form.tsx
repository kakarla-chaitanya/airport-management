import { useState } from "react";
import "../../home_form.css";
import type {UserForm} from "../../../../models/user";
import { Roles } from "../../../../models/roles";
import { useLoaderContext } from "../../../../context/loader_context";
import { useMessageContext } from "../../../../context/message_context";
import { register } from "../../../../services/auth_service";
import CustomDropdown from "../../../../components/custom_dropdown";

type AddUserFormProps = {
  onCancel:()=>void;
};

export default function AddUserForm({ onCancel }: AddUserFormProps) {

  const setLoading=useLoaderContext();
  const {addFormErrorMessage}=useMessageContext();

  const [user, setUser] = useState<UserForm>({
    name: "",
    email: "",
    role: Roles.airlineStaff,
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (user.name.trim().length===0){
      addFormErrorMessage("Empty Name");
      return;
    }
    if (user.email.trim().length===0){
      addFormErrorMessage("Empty Email");
      return;
    }
    if (user.password.trim().length===0){
      addFormErrorMessage("Empty Name");
      return;
    }
    if (user.name.trim().length>50){
      addFormErrorMessage("Name can be of maximum of 50 characters");
      return;
    }
    if (user.password.trim().length<8){
      addFormErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (!(/[a-zA-Z]/.test(user.password.trim()) && /\d/.test(user.password.trim()))){
      addFormErrorMessage("Password must contain both letters and numbers");
      return;
    }
    setLoading(true);
    const res=await register(user);
    if (res){
      onCancel();
    }
    setLoading(false);
  }

  return (
    <form className="home-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="home-form-row">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="home-form-input"
          autoComplete="off"
          required
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          className="home-form-input"
          autoComplete="off"
          required
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="role">Role *</label>
        <CustomDropdown<string>
          options={Object.values(Roles).filter((x)=>typeof x==="string").filter((x) => x !==Roles.admin && x!==Roles.user)}
          value={user.role}
          toString={(role)=>{
            console.log(role);
            return role;
          }}
          onChange={(val) => setUser((prev) => ({ ...prev, role: val as Roles }))}
          placeholder="Select role"
          className="full-width"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          className="home-form-input"
          required
        />
      </div>

      <div className="home-form-actions">
        <button type="submit" className="home-form-submit-btn">
          Add User
        </button>
        <button
          type="button"
          className="home-form-cancel-btn"
          onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if(onCancel) onCancel();
          }}
        >
          Cancel
        </button>
      </div>

    </form>
  );
}
