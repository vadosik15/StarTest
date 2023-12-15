// DropDown.tsx
import React, { useState, useRef, useEffect } from 'react';
import './DropDown.css';

type DropDownProps = {
  options: string[];
  onChange: (selectedOption: string | null) => void;
};

const DropDown: React.FC<DropDownProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className="selected-option"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || 'Select a game mode'}
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropDown;
