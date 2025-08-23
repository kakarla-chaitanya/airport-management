import GlobalError from "./global_error";

export default class DataConsistencyError extends GlobalError{
    constructor(mesaage:string){
        super(mesaage,"Data Consistency Error",409,"DATA_CONSISTENC_ERROR");
    }
}