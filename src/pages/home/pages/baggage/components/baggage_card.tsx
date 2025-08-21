import { MdDelete, MdEdit } from 'react-icons/md';
import type { Baggage } from '../../../../../models/baggage';
import './styles/baggage_card.css';


interface BaggageCardProps {
  baggage: Baggage;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const BaggageCard = ({ baggage, onEdit, onDelete }: BaggageCardProps) => {
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
        <div><strong>Created By:</strong> {baggage.createdBy}</div>
        {baggage.lastLocation && (
          <div><strong>Last Location:</strong> {baggage.lastLocation}</div>
        )}
      </div>

      <div className="baggage-card-actions">
        <button className="icon-btn edit-btn" onClick={() => onEdit?.(baggage._id)}>
            <MdEdit style={{ marginRight: "6px" }} />
            Edit
        </button>
        <button className="icon-btn delete-btn" onClick={() => onDelete?.(baggage._id)}>
          <MdDelete style={{ marginRight: "6px" }} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BaggageCard;
