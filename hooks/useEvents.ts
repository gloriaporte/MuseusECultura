import { findByEvents } from "@/services/requests/findByEvents";
import { findOccurrencesBySpace } from "@/services/requests/findOccurrencesBySpace";
import { useEffect, useState } from "react";

export const useEvents = (month: number, year: number) => {
  const [eventsBySpace, setEventsBySpace] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await findByEvents(month, year);

      if (result.tipo === "sucesso" && Array.isArray(result.data)) {
        const from = `${year}-${String(month).padStart(2, "0")}-01`;
        const to = `${year}-${String(month).padStart(2, "0")}-31`;

        // Para cada espaço, buscamos seus eventos
        const allSpaces = await Promise.all(
          result.data.map(async (space) => {
            const occurrences = await findOccurrencesBySpace(space.id, from, to);
            return {
              ...space,
              events: occurrences,
            };
          })
        );

        setEventsBySpace(allSpaces);
      }

      setLoading(false);
    };

    load();
  }, [month, year]);

  return { eventsBySpace, loading };
};
