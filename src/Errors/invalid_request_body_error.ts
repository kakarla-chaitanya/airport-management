import GlobalError from "./global_error";

export default class InvalidRequestBodyError extends GlobalError{
    constructor(message:string,details:string|null|[any]|Object=null){
        super(message,"Invalid Request Body Error",400,"INVALID_REQUEST_BODY_ERROR",details);
    }
}