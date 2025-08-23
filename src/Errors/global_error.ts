export default class GlobalError extends Error{
    name:string;
    statusCode:number;
    code:string;
    details:any;

    constructor(message:string,name:string="Global Error",statusCode:number=404,code:string="",details:any=null){
        super(message);
        this.name=name;
        this.code=code;
        this.statusCode=statusCode;
        this.details=details;
    }
}