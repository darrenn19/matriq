import React, { useState } from "react";
import "./matrix.css";

const Matrix = () => {
  const [query, setQuery] = useState("");

  const matrices = [
    { id: 1, name: "Matrix 1" },
    { id: 2, name: "Matrix 2" },
    { id: 3, name: "Matrix 3" },
  ];

  console.log("Matrices:");

  const filteredMatrices = matrices.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="matrix-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search matrices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>New Matrix</button>
      </div>
      <div className="matrix-grid">
        {filteredMatrices.map((matrix) => (
          <div key={matrix.id} className="matrix-card">
            {matrix.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matrix;
