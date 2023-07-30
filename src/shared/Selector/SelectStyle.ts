import { StylesConfig } from 'react-select';

export function SelectStyle() {
    const customStyles: StylesConfig<any> = {
        control: (provided) => ({
            ...provided,
            fontSize: 14,
            backgroundColor: '#ffffff',
            borderRadius: 6,
            height: 42,
            cursor: 'pointer',
        }),
        menu: (provided: any) => ({
            ...provided,
            marginTop: 8,
            borderRadius: 6,
            backgroundColor: '#ffffff',
        }),
        dropdownIndicator: (provided, state: any) => ({
            ...provided,
            color: '#737373',
            rotate: state.isFocused && '180deg',
        }),
        option: (provided, { isSelected }: any) => {
            let dropDownContainerColor = ''
            dropDownContainerColor = isSelected ? '#ffffff' : '#31343F';
            let dropDownBgContainerColor = ''
            dropDownBgContainerColor = isSelected ? '#155E75' : '#ffffff';

            return {
                ...provided,
                cursor: 'pointer',
                borderRadius: 6,
                color: dropDownContainerColor,
                backgroundColor: dropDownBgContainerColor,
                fontWeight: 500,
                fontSize: 14,
                '&:hover': {
                    color: '#31343F',
                    backgroundColor: '#E0E0E0'
                },
            };
        },
        input: (styles) => ({
            ...styles,
            color: '#31343F',
            border: 0
        }),
        singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: '#31343F',
        }),
    };
    return customStyles;
}
