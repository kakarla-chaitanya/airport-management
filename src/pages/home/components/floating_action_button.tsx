import type { MouseEventHandler } from "react";
import { MdAdd } from "react-icons/md";
import "./styles/floating_action_button.css";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function FloatingActionButton({ onClick }: Props) {
  return (
    <button className="fab-button" onClick={onClick}>
      <MdAdd size={24} />
      New
    </button>
  );
}
