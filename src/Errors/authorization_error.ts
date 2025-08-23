import GlobalError from "./global_error";

export default class AuthorizationError extends GlobalError{
    constructor(message:string){
        super(message,"Authorization Error",403,"AUTHORIZATION_ERROR");
    }
}
