import { findOne } from "@/services/requests/findOne";
import { SpaceDetail } from "@/types/SpaceDetail";
import { useEffect, useState } from "react";

export function useSpaceDetail(id: number) {
  const [space, setSpace] = useState<SpaceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findOne(id)
      .then(setSpace)
      .finally(() => setLoading(false));
  }, [id]);

  return { space, loading };
}
