import { findByEvents } from "@/services/requests/findByEvents";
import { findOccurrencesBySpace } from "@/services/requests/findOccurrencesBySpace";
import { useEffect, useState } from "react";

export const useEventsWithOccurrences = (month: number, year: number) => {
  const [spacesWithEvents, setSpacesWithEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const spacesResult = await findByEvents(month, year);
        if (spacesResult.tipo !== "sucesso") {
          setSpacesWithEvents([]);
          setLoading(false);
          return;
        }

        const from = `${year}-${String(month).padStart(2, "0")}-01`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const to = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

        const allData = await Promise.all(
          spacesResult.data.map(async (space: any) => {
            const occurrences = await findOccurrencesBySpace(space.id, from, to);
            return {
              ...space,
              occurrences: occurrences.tipo === "sucesso" ? occurrences.data : [],
            };
          })
        );

        setSpacesWithEvents(allData);
      } catch (error) {
        console.error("Erro em useEventsWithOccurrences:", error);
        setSpacesWithEvents([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month, year]);

  return { spacesWithEvents, loading };
};
