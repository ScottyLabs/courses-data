import { SearchEngine } from "courses-data";
import { useMemo, useState } from "react";

export function App() {
  const search = useMemo(
    () => new SearchEngine(["/api/lunr-index", "/api/courses-data"]),
    []
  );
  const [response, setResponse] = useState<any[]>([]);

  return (
    <div className="app">
      <input onChange={(e) => setResponse(search.query(e.target.value))} />
      {response.slice(0, 10).map((course) => {
        return (
          <p>
            {course.id}: {course.name} | {course.desc}
          </p>
        );
      })}
      <p>{response.at(0)?.name}</p>
    </div>
  );
}

export default App;
