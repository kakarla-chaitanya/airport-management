import { model } from "mongoose";
import BaggageSchema from "./baggage_schema";

const Baggage=model("baggage",BaggageSchema);

export default Baggage;