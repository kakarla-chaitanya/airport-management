import type { UserForm } from "../models/user";
import { httpGet, httpPost } from "./http_service";
const baseUrl="/auth";
export async function verifyUser() {
    const res=await httpGet(baseUrl+"/verify",{handleError:false});
    return res;
}

export async function login(email:string,password:string) {
    const res=await httpPost(baseUrl+"/login",{
        email,
        password,
    });
    return res;
}

export async function register(user:UserForm) {
    const res=await httpPost(baseUrl+"/register",user);
    return res;
}

export async function registerUser(name:string,email:string,password:string) {
    const res= await httpPost(baseUrl+"/register-user",{
        name,
        email,
        password
    });
    return res;
}

export async function logout() {
    const res=await httpGet(baseUrl+"/logout");
    return res;
}
