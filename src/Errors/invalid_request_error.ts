import GlobalError from "./global_error";

export default class InvalidRequestError extends GlobalError{
    constructor(message:string){
        super(message,"Invalid Request",422,"INVALID_REQUEST");
    }
}