import { useState } from "react";
import { BiTime, BiUserCircle } from "react-icons/bi";

const Accordion = ({ item }: any) => {
    const { id, title, content, user, added_by, createdAt } = item;
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border rounded mb-4">
            <button className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b w-full" style={{ backgroundColor: "rgb(255, 213, 46)" }} onClick={toggleAccordion}>
                <h2 className="text-lg font-medium">{title}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                    viewBox="0 0 20 20" fill="currentColor" >
                    <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75z" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4" style={{ backgroundColor: "rgb(229, 229, 229)" }}>
                    <p className="font-medium text-cyan-800 text-sm">{content}</p>
                    <div className="inline-flex items-center justify-between w-full">
                        <p className="font-normal text-gray-800 text-xs inline-flex items-center justify-between"><BiUserCircle />&nbsp; {added_by}</p>
                        <p className="font-normal text-gray-800 text-xs inline-flex items-center justify-between"><BiTime />&nbsp; {createdAt.substr(0, 10)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accordion;