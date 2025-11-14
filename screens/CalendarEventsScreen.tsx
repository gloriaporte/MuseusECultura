import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useEventsWithOccurrences } from "@/hooks/useEventsWithOccurrences";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Configuração do calendário em pt-BR
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],
  monthNamesShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ],
  dayNames: [
    "Domingo", "Segunda", "Terça", "Quarta",
    "Quinta", "Sexta", "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

// Função utilitária para extrair apenas a data YYYY-MM-DD
function extractDateOnly(dateStr: string) {
  return dateStr.slice(0, 10); // ignora hora e fuso horário
}

const CalendarEventsScreen = () => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const { theme } = useTheme();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(todayStr);

  const { spacesWithEvents, loading } = useEventsWithOccurrences(month, year);

  // Mapeia todos os eventos
  const allEvents = spacesWithEvents.flatMap((s) =>
    (s.occurrences || []).map((occ) => {
      const startDate = occ.starts?.date || occ.starts_at || null;
      const dateStr = startDate ? extractDateOnly(startDate) : null;

      return {
        key: `${occ.occurrence_id}-${occ.event?.id || Math.random()}`,
        id: occ.event?.id || occ.occurrence_id,
        name: occ.event?.name || "Evento sem nome",
        starts_at: dateStr,
        spaceName: s.name,
        endereco: s.endereco
      };
    })
  );

  // Filtra eventos do dia selecionado
  const visibleEvents = allEvents.filter((e) => e.starts_at === selected);

  // Marca datas no calendário
  const markedDates = allEvents.reduce((acc, e) => {
    if (e.starts_at) {
      acc[e.starts_at] = { marked: true, dotColor: "#9C4BED" };
    }
    return acc;
  }, {} as Record<string, any>);

  // Marca o dia selecionado
  markedDates[selected] = {
    ...(markedDates[selected] || {}),
    selected: true,
    selectedColor: "#9C4BED",
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>

      {/* Calendário */}
      <Calendar
        key={theme}
        current={todayStr}
        onDayPress={(day) => setSelected(day.dateString)}
        onMonthChange={(monthObj) => {
          setMonth(monthObj.month);
          setYear(monthObj.year);
        }}
        markedDates={markedDates}
        theme={{
          backgroundColor: Colors[theme].background,
          calendarBackground: Colors[theme].background,
          monthTextColor: Colors[theme].text,
          dayTextColor: Colors[theme].text,
          textDisabledColor: "#999",
          todayTextColor: "#9C4BED",
          arrowColor: "#9C4BED",
          textSectionTitleColor: "#9C4BED"
        }}
      />

      {/* Lista de eventos scrollável */}
      <View style={styles.eventsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#9C4BED" />
        ) : (
          <FlatList
            data={visibleEvents}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <View style={styles.eventDot} />
                <Text style={[styles.eventText, {color: Colors[theme].text}]}>
                  {item.name || "Sem nome"}{" "}
                  {item.starts_at
                    ? `– ${item.starts_at.slice(8,10)}/${item.starts_at.slice(5,7)}`
                    : "– sem data"}{" "}
                  <Text style={{ color: "#aaa" }}>({item.spaceName})</Text>
                  <Text style={{ color: "#aaa" }}> - {item.endereco}</Text>
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum evento encontrado para este dia.
              </Text>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
};

export default CalendarEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9C4BED",
    marginRight: 8,
  },
  eventText: {
    color: "#fff",
    fontSize: 14,
    flexShrink: 1,
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 15,
  },
});
