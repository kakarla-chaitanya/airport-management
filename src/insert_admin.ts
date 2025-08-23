import "./config/db";
import { connectDB, disconnectDB } from "./config/db";
import { Roles } from "./models/roles";
import User from "./models/user/user_model";
import bcrypt from "bcrypt";

(async () => {
    try{
        await connectDB();
        const admin=await User.findOne({role:Roles.admin});
        if (admin){
            console.log("Already there is admin");
            await disconnectDB();
            return;
        }
        const password=await bcrypt.hash("Gray@123$",10);
        const newAdmin=new User({
            name:"admin",
            email:"chaitanya.kakarla@graymatter.co.in",
            role:Roles.admin,
            password,
        });
        await newAdmin.save();
        console.log("Admin added successfully");
        await disconnectDB();
        return ;
    }catch(e){
        console.log(e);
    }
})();