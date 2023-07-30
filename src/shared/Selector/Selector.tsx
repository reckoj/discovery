import React, { FC, useRef } from "react";
import Select from "react-select";
import { SelectStyle } from "./SelectStyle";

interface OptionProps {
    label: string;
    value: string;
}

interface SelectProps {
    options: any;
    isSearchable?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    defaultValue?: OptionProps | string;
    value?: string;
    onChange?: any;
}

const Selector: FC<SelectProps> = ({
    options,
    isSearchable,
    placeholder,
    className,
    value,
    defaultValue,
    onChange,
    disabled,
}: SelectProps) => {
    const customStyles = SelectStyle();
    const selectRef = useRef(!null);

    return (
        <Select
            isDisabled={disabled}
            placeholder={<p className={"text-neutral-04"}>{placeholder}</p>}
            ref={selectRef as any}
            onInputChange={(value: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                selectRef.current;
            }}
            className={className}
            isSearchable={isSearchable}
            defaultValue={defaultValue}
            value={value}
            styles={customStyles}
            onChange={onChange}
            options={options}
            // component props used to hide the IndicatorSeparator that is given by default between input and icons
            components={{
                IndicatorSeparator: () => null,
            }}
        />
    );
};
Selector.defaultProps = {};
export default Selector;
