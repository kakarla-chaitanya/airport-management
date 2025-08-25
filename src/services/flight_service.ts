import type { Flight } from "../models/flight";
import { httpDelete, httpGet, httpPost, httpPut } from "./http_service"

const baseUrl="/flight"
export async function getAllFlights() {
    const res=await httpGet(baseUrl);
    return res.data;
}
export async function addNewFlight(flight:Flight) {
    const {_id,createdBy,...body}=flight;
    const res=await httpPost(baseUrl,body);
    return res;
}
export async function updateExistingFlight(flight:Flight) {
    const {_id,createdBy,...body}=flight;
    const res=await httpPut(baseUrl,body,{params:{
        id:_id,
    }});
    return res;
}

export async function deleteExistingFlight(id:string) {
    const res=await httpDelete(baseUrl,{params:{id}});
    return res;
}