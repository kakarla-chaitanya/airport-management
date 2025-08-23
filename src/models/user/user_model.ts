import { model } from "mongoose";
import UserSchema from "./user_schema";

const User=model("user",UserSchema);

export default User;