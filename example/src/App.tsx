import { Course, SearchEngine } from "courses-data";
import { useMemo, useState } from "react";

export function App() {
  const search = useMemo(() => new SearchEngine(["sdf","sdf"]), []);

  const [response, setResponse] = useState<Course[]>([]);

  return (
    <div className="app">
      <input
        onChange={(e) => setResponse(search.query(e.target.value))}
      />
      <p>{response.at(0)?.name}</p>
    </div>
  );
}

export default App;
