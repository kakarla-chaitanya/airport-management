import type { Baggage } from "../models/baggage";
import { httpDelete, httpGet, httpPost, httpPut } from "./http_service"

const baseUrl="/baggage"

export async function getAllBaggages(){
    const res=await httpGet(baseUrl);
    return res.data;
}

export async function addNewBaggage(baggage:Baggage) {
    const {_id,createdBy,...body}=baggage;
    const res=await httpPost(baseUrl,body);
    return res;
}

export async function updateExistingBaggage(baggage:Baggage) {
    const {_id,createdBy,...body}=baggage;
    const res=await httpPut(baseUrl,body,{params:{id:_id}});
    return res;
}

export async function deleteExistingBaggae(id:string) {
    const res=await httpDelete(baseUrl,{params:{id}});
    return res;
}