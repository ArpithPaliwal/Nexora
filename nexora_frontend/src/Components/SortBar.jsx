import React from "react";

export default function SortBar({ sortBy, setSortBy, sortType, setSortType }) {
  return (
    <div className="flex gap-4 my-4">

      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-accent text-gray-500 px-3 py-2 rounded-2xl  text-sm "
      >
        
        <option value="createdAt" >Sort by: Created At</option>
        <option value="views">Sort by: Views</option>
        
        
      </select>

      {/* Sort Type */}
      <select
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        className="bg-accent text-gray-500 px-3 py-2 rounded-2xl  text-sm"
      >
        <option value="desc">Descending (DESC)</option>
        <option value="asc">Ascending (ASC)</option>
      </select>

    </div>
  );
}
