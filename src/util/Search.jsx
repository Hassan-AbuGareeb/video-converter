"use client";
import { React, useState } from "react";

const Search = ({ onSearchClick }) => {
  const [localSearch, setLocalSearch] = useState("");

  function handleSearchChange(event) {
    setLocalSearch(event.target.value);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    onSearchClick(localSearch);
  }

  return (
    <div className="flex justify-center my-5">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search..."
          className="px-2 rounded-sm "
          value={localSearch}
          onChange={handleSearchChange}
        />
        <input
          type="submit"
          className="text-slate-300 ml-4 bg-slate-600 rounded-md font-semibold px-3 py-1 hover:bg-slate-700"
          value={"search"}
        />
      </form>
    </div>
  );
};

export default Search;
