import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
    options: any[];
    icon: any;
    onClick: any;
}

const Dropdown: React.FC<DropdownProps> = ({ options, icon, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <span onClick={toggleDropdown}>{icon}</span>
            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[120px] z-10">
                    <ul>
                        {React.Children.toArray(
                            options?.map((option) => (
                                <li className="px-4 py-2 cursor-pointer hover:bg-transparent text-sm" onClick={()=>onClick(option)}>
                                    {option.title}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
