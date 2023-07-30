import React from "react";

type ButtonProps = {
    type?: "primary" | "secondary" | "danger" | "outlined" | "ghost"; // Button type
    size?: "small" | "medium" | "large"; // Button size
    onClick?: () => void; // Click event handler
    disabled?: boolean; // Disable the button
    loading?: boolean; // Show loading state
    htmlType?: "button" | "submit" | "reset"; // HTML button type
    prefix?: React.ReactNode; // Prefix icon
    suffix?: React.ReactNode; // Suffix icon
    className?: string; // Custom CSS className
    children?: React.ReactNode; // Suffix icon
    style?: React.CSSProperties; // button style
};

const Button: React.FC<ButtonProps> = ({
    type = "primary",
    size = "medium",
    onClick,
    disabled = false,
    loading = false,
    htmlType = "button",
    prefix,
    suffix,
    className = "",
    children,
    style,
    ...props
}) => {
    // Map button type to Tailwind CSS className
    const getTypeClass = () => {
        switch (type) {
            case "secondary":
                return "bg-gray-300 text-gray-700 hover:bg-gray-400";
            case "danger":
                return "bg-red-500 text-white hover:bg-red-600";
            case "outlined":
                return "inline-block rounded border text-cyan-900 bg-white hover:bg-white hover:border-cyan-900";
            case "ghost":
                return "inline-block shadow rounded border text-cyan-900 bg-white hover:bg-white";
            default:
                return "bg-cyan-800 text-white hover:bg-cyan-900";
        }
    };

    // Map button size to Tailwind CSS className
    const getSizeClass = () => {
        switch (size) {
            case "small":
                return "px-2 py-1 text-sm";
            case "large":
                return "px-6 py-3 text-lg";
            default:
                return "px-4 py-2 text-base";
        }
    };

    return (
        <div className="flex items-center justify-center">
            <button
                style={style}
                onClick={onClick}
                disabled={disabled || loading}
                type={htmlType}
                {...props}
                className={`
        inline-flex justify-center items-center px-4 py-2 text-sm font-semibold leading-6 transition duration-150 ease-in-out bg-cyan-800 rounded-md shadow hover:bg-cyan-900 
        ${getTypeClass()} ${getSizeClass()} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""
                    } ${className}`}
            >
                {loading && (
                    <svg
                        className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {prefix && <span className="mr-2">{prefix}</span>}
                {children}
                {suffix && <span className="ml-2">{suffix}</span>}
            </button>
        </div>
    );
};

export default Button;
