import React, { useState } from "react";
import type { Baggage } from "../../../../../models/baggage";
import "../../../home_form.css";
import { BaggageStatus } from "../../../../../models/baggage_status";
import { useLoaderContext } from "../../../../../context/loader_context";
import { useMessageContext } from "../../../../../context/message_context";
import { addNewBaggage, updateExistingBaggage } from "../../../../../services/baggage_service";
import CustomDropdown from "../../../../../components/custom_dropdown";

type BaggageFormProps = {
  initialData?: Partial<Baggage>;
  onCancel: () => void;
  setBaggages:React.Dispatch<React.SetStateAction<Baggage[]>>;
  editIdx?:number;
};

export default function BaggageForm({ initialData = {}, onCancel, setBaggages,editIdx }: BaggageFormProps) {

  const setLoading=useLoaderContext();
  const {addFormErrorMessage}=useMessageContext();

  const [baggage, setBaggage] = useState<Baggage>({
    _id:"",
    tagId: "",
    flightId: "",
    weight: 0,
    status: BaggageStatus.atBelt,
    lastLocation: "",
    createdBy:"",
    ...initialData,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setBaggage((prev) => ({
      ...prev,
      [name]: name === "weight" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (baggage.tagId.trim().length==0){
     addFormErrorMessage("Empty Tag-ID");
      return;
    }
    if (baggage.flightId.trim().length==0){
      addFormErrorMessage("Empty Flight-ID");
      return;
    }
    if (baggage.weight<0 || baggage.weight>100){
      addFormErrorMessage("Weight should be in range of 0-100 kg");
      return;
    }
    if (baggage.status.trim().length==0){
      addFormErrorMessage("Empty Status");
      return;
    }
    setLoading(true);
    if (editIdx!==undefined){
      const res=await updateExistingBaggage(baggage);
      if (res){
        setBaggages((prev)=>{
          const updated=[...prev];
          updated[editIdx]=res;
          return updated;
        });
        onCancel();
      }
    }else{
      const res=await addNewBaggage(baggage);
      if (res){
        setBaggages((prev)=>[...prev,res]);
        onCancel();
      }
    }
    setLoading(false);
  }

  return (
    <form className="home-form" onSubmit={handleSubmit}>
      <div className="home-form-row">
        <label htmlFor="tagId">Tag ID *</label>
        <input
          type="text"
          id="tagId"
          name="tagId"
          value={baggage.tagId}
          onChange={handleChange}
          className="home-form-input"
          placeholder="Tag-ID"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="flightId">Flight ID *</label>
        <input
          type="text"
          id="flightId"
          name="flightId"
          value={baggage.flightId}
          onChange={handleChange}
          className="home-form-input"
          placeholder="Flight-ID"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="weight">Weight (kg) *</label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={baggage.weight?.toString()}
          onChange={handleChange}
          className="home-form-input"
          placeholder="Weight"
        />
      </div>

    <div className="home-form-row">
      <label htmlFor="status">Status *</label>
      <CustomDropdown<string>
        options={Object.values(BaggageStatus).filter((r) => typeof r === "string")}
        value={baggage.status}
        toString={(val)=>val}
        onChange={(val) => setBaggage((prev) => ({ ...prev, status: val as BaggageStatus }))}
        placeholder="Select Status"
        className="full-width"
      />
    </div>

      <div className="home-form-row">
        <label htmlFor="lastLocation">Last Location</label>
        <input
          type="text"
          id="lastLocation"
          name="lastLocation"
          value={baggage.lastLocation || ""}
          onChange={handleChange}
          className="home-form-input"
          placeholder="Last Location"
        />
      </div>

      <div className="home-form-actions">
        <button type="submit" className="home-form-submit-btn">
          {editIdx!==undefined ? "Update Baggage" : "Add Baggage"}
        </button>
        <button
          type="button"
          className="home-form-cancel-btn"
          onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if(onCancel) onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
