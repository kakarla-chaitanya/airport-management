import GlobalError from "./global_error";

export default class AuthenticationError extends GlobalError{

    constructor(message:string,details:string|null=null){
        super(message,"Authentication Error",401,"AUTHENTICATION_ERROR",details);
    }
}