import { useEffect, useState } from "react";
import healthService from "../services/health";

const Health = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const health = async () => {
      try {
        const data = await healthService.getHealth();
        setStatus(data);
      } catch {
        setStatus("Server unavailable");
      }
    };
    health();
  }, []);

  return <>{status && <p>{status}</p>}</>;
};

export default Health;
