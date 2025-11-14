import { findAll } from "@/services/requests/findAll";
import { SpaceSummary } from "@/types/SpaceSummary";
import { useEffect, useState } from "react";

export function useSpaces() {
  const [spaces, setSpaces] = useState<SpaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findAll()
      .then(setSpaces)
      .finally(() => setLoading(false));
  }, []);

  return { spaces, loading };
}
