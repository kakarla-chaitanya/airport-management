import GlobalError from "./global_error";

export default class EntityNotFoundError extends GlobalError{
    constructor(message:string){
        super(message,"Entity Not Found Error",404,"ENTITY_NOT_FOUND_ERROR");
    }
}