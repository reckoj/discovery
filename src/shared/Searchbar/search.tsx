import React, { ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }: any) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    onSearch(searchTerm);
  };
  return (
    <div className="relative flex w-[200px]">
      <input
        type="text"
        placeholder="Search..."
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grey"
        onChange={handleInputChange}
      />
      <span className="h-6 w-6 absolute right-1 top-3 text-gray-400">
        <FiSearch />
      </span>
    </div>
  );
};

export default SearchBar;
