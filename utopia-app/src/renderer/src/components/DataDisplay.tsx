import { useEffect, useState } from "react";
import axios from "axios"

interface DataItem {
  _id: string;
  race: string;
  talentTree: string;
}

export default function DataDisplay() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/api/data") // Connect to Express API
      .then((res) => {
        console.log(res.data)
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>MongoDB Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.race}: {item.talentTree}
          </li>
        ))}
      </ul>
    </div>
  );
}