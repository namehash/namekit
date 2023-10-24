import { useState, useEffect } from "react";
import { nameguard } from "@namehash/nameguard";

export function useInspectName(name = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (name) {
      setLoading(true);
      setError(null);
      setData(null);

      nameguard
        .inspectName(name)
        .then((result) => {
          setData(result);
        })
        .catch((err) => {
          setError(err);
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [name]);

  return {
    loading,
    error,
    data,
  };
}
