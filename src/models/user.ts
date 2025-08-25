import type { Roles } from "./roles";

export default interface User {
    _id:string,
    name:string,
    email:string,
    role:Roles,
    password?:string;
}

export type UserForm = Omit<User, "_id"> & { password: string };
