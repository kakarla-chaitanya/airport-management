import { useEffect, useRef } from "react";
import "./styles/floating_slide_panel.css";

type FloatingSlidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function FloatingSlidePanel({ isOpen, onClose, children }: FloatingSlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="slide-panel-overlay" />}
      <div ref={panelRef} className={`slide-panel ${isOpen ? "open" : ""}`}>
        <div className="slide-panel-content">{children}</div>
      </div>
    </>
  );
}
