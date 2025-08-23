import GlobalError from "./global_error";

export default class RateLimiterError extends GlobalError{
    constructor (message:string){
        super(message,"Rate Limiter Error",429,"RATE_LIMITER_ERROR");
    }
}