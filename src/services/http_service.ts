import axios from "axios";
import api from "./api";
import getOrCreateDeviceId from "../utils/get_or_create_device_id";
import { triggerToast } from "../utils/toast";

const defaultHeaders={
    "Content-Type":"application/json",
    'Cache-Control': 'no-cache',
    "x-device-id":getOrCreateDeviceId(),
}

function _includeDefaultHeaders(headers:{}){
    return {...headers,...defaultHeaders};
}

export async function httpGet(path:string,{params={},headers={},handleError=true}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.get(path,{
            headers:headers,
            params:params,
        });
        return res.data;    
    }catch(error){
        if(handleError){
            _handleError(error);
        }
    }
}

export async function httpPost(path:string,body:any,{params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.post(path,body,{
            headers:headers,
            params:params,
        });
    
        return res.data;
    }
    catch(error){
        _handleError(error);
    }
}

export async function httpPut(path:string,body:any,{params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res= await api.put(path,body,{
            headers:headers,
            params:params,
        });
        return res.data;
    }catch(error){
        _handleError(error);
    }
}

export async function httpDelete(path:string,{data={},params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.delete(path,{
            headers:headers,
            params:params,
            data:{
                source:data,
            }
        });
        return res.data;
    }catch(error){
        _handleError(error);
    }
}

function _handleError(error:any){
    if (
        axios.isAxiosError(error) && 
        error.response &&
        typeof error.response.data==="object" && 
        error.response.data!==null &&
        "code" in error.response.data &&
        "name" in error.response.data &&
        "message" in error.response.data
    ){
        switch (error.response.data.code){
            case "AUTHENTICATION_ERROR":
            case "AUTHORIZATION_ERROR":
            case "DATA_CONSISTENCY_ERROR":
            case "ENTITY_NOT_FOUND_ERROR":
            case "INVALID_REQUEST":
            case "RATE_LIMITER_ERROR":
                triggerToast(`${error.response.data.name} : ${error.response.data.message}`);
                break;
            case "SESSION_VALIDATION_ERROR":
                triggerToast(`${error.response.data.name} : ${error.response.data.message}`);
                break;
            case "INVALID_REQUEST_BODY_ERROR":
                if (!("details" in error.response.data)){
                    triggerToast(`${error.response.data.name} : ${error.response.data.message}`);
                }else{
                    const details=error.response.data.details;
                    if (typeof details === 'string') {
                      triggerToast(details);
                    } else if (Array.isArray(details)) {
                      details.forEach((detail) => {
                        if (typeof detail === 'object' && 'msg' in detail) {
                          triggerToast(detail.msg);
                        }
                      });
                    }else if (typeof details === 'object') {
                      triggerToast(`${error.response.data.name} : ${error.response.data.message}`);
                    }
                }
                break;
            default:
                triggerToast(`${error.response.data.name} : ${error.response.data.message}`);
        }
    }else if (typeof error.response.data==="string"){
        triggerToast(`${error.response.status} - ${error.response.dashboard}`);
    }else{
        triggerToast("Unexpected Error");
    }
}