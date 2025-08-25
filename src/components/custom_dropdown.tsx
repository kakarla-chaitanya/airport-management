import { useEffect, useRef, useState } from "react";
import "./styles/custom_dropdown.css";

type CustomDropdownProps<T> = {
  options: T[];
  value?: T;
  onChange: (value: T) => void;
  toString:(value:T)=>string;
  className?: string;
  placeholder?: string;
  id?:string;
};

export default function CustomDropdown<T>({
  options,
  value,
  onChange,
  toString,
  className = "",
  placeholder = "Select...",
  id="",
}: CustomDropdownProps<T>) {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && menuRef.current) {
      const selectedOption = menuRef.current.querySelector(".custom-dropdown-option.selected") as HTMLElement | null;
      if (selectedOption) {
        const offsetTop = selectedOption.offsetTop;
        const scrollTop = offsetTop - 8;
        menuRef.current.scrollTop = scrollTop > 0 ? scrollTop : 0;
      } else {
        menuRef.current.scrollTop = 0;
      }
    }
  }, [open]);

  const handleOptionClick = (option: T) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      id={id}
      className={`custom-dropdown-container ${className}`}
      ref={dropdownRef}
      tabIndex={0}
      onBlur={() => setOpen(false)}
    >
      <div
        className="custom-dropdown-selected"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value
        ?
          toString(value).length==0
            ?
            placeholder
            :
            toString(value)
        :
          placeholder}
        <span className="custom-dropdown-arrow">&#9662;</span>
      </div>
      {open && (
        <ul className="custom-dropdown-menu" ref={menuRef} role="listbox">
          {options.map((option,idx) => (
            <li
              key={idx}
              className={`custom-dropdown-option ${option === value ? "selected" : ""}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option === value}
            >
              {toString(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
