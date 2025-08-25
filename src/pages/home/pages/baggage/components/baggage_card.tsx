import { MdDelete, MdEdit } from 'react-icons/md';
import type { Baggage } from '../../../../../models/baggage';
import './styles/baggage_card.css';
import { useFloatingslidePanelContext } from '../../../../../context/floating_slide_panel_context';
import BaggageForm from './baggage_form';
import { useLoaderContext } from '../../../../../context/loader_context';
import { deleteExistingBaggae } from '../../../../../services/baggage_service';
import { useAuthContext } from '../../../../../context/auth_context';
import { Roles } from '../../../../../models/roles';


interface BaggageCardProps {
  baggage: Baggage;
  index:number;
  setBaggages: React.Dispatch<React.SetStateAction<Baggage[]>>
}

const BaggageCard = ({ baggage,index,setBaggages}: BaggageCardProps) => {

  const {user}=useAuthContext();
  const setLoading=useLoaderContext();
  const {setChild,setOpen}=useFloatingslidePanelContext();

  function onEdit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    setChild(<BaggageForm 
      editIdx={index}
      setBaggages={setBaggages} 
      initialData={baggage} 
      onCancel={()=>{
        setOpen(false);
        setChild(null);
    }}/>)
    setOpen(true);
  }

  async function onDelete(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res=await deleteExistingBaggae(baggage._id);
    if (res){
      setBaggages((prev)=>{
        const updated=prev.filter((x) => x._id !== res._id);
        return updated;
      })
    }
    setLoading(false);
  }
  return (
    <div className="baggage-card">
      <div className="baggage-card-header">
        <h3>{baggage.tagId}</h3>
        <span className={`status-badge status-${baggage.status.toLowerCase()}`}>
          {baggage.status}
        </span>
      </div>

      <div className="baggage-card-body">
        <div><strong>Flight:</strong> {baggage.flightId}</div>
        <div><strong>Weight:</strong> {baggage.weight.toString()} kg</div>
        <div><strong>Last Location:</strong> {baggage.lastLocation?baggage.lastLocation:"--"}</div>
      </div>

      {(user?.role===Roles.admin || user?.role===Roles.airlineStaff || user?.role===Roles.baggageStaff)
        &&
        <div className="baggage-card-actions">
          <button className="icon-btn edit-btn" onClick={onEdit}>
              <MdEdit style={{ marginRight: "6px" }} />
              Edit
          </button>
          <button className="icon-btn delete-btn" onClick={onDelete}>
            <MdDelete style={{ marginRight: "6px" }} />
            Delete
          </button>
        </div>
      }
    </div>
  );
};

export default BaggageCard;
