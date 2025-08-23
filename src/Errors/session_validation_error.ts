import GlobalError from "./global_error";

export default class SessionValidationError extends GlobalError{
    constructor(message:string){
        super(message,"Session Validation Error",401,'SESSION_VALIDATION_ERROR');
    }
}