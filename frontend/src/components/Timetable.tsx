import React, { useMemo, useRef, useEffect } from "react";
import { Table, Text, Paper, Stack } from "@mantine/core";

type ScheduleEntry = {
  subject: string;
  instructor: string;
  room: string;
  time: string;
};

type ApiResponse = {
  student_group: string;
  timetable: Record<string, Record<string, ScheduleEntry>>;
};

type TimetableProps = {
  data: ApiResponse | null;
  studentProfileColor: string;
};

const formatTime = (time: string) =>
  time
    .split(" - ")
    .map((t) => t.substring(0, 5))
    .join(" - ");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getCurrentDayIndex = () => {
  const jsDay = new Date().getDay(); 
  if (jsDay >= 1 && jsDay <= 5) return jsDay - 1;
  return null;
};

const TimetableCell: React.FC<{
  entry?: ScheduleEntry;
  studentProfileColor: string;
}> = ({ entry, studentProfileColor }) => {
  if (!entry) {
    return (
      <Text color="gray.5" align="center">
        -
      </Text>
    );
  }

  return (
    <Paper shadow="sm" radius="md" p="sm" withBorder>
      <Stack spacing={2} align="center" justify="center" h={"100%"}>
        <Text weight={700} color={studentProfileColor} size="sm" align="center">
          {entry.subject}
        </Text>
        <Text color="dark" size="sm" align="center">
          {entry.instructor || ""}
        </Text>
        <Text color="gray.7" size="sm" align="center">
          {entry.room || ""}
        </Text>
        <Text color="gray.5" size="xs" align="center">
          {formatTime(entry.time) || ""}
        </Text>
      </Stack>
    </Paper>
  );
};

const Timetable: React.FC<TimetableProps> = ({
  data,
  studentProfileColor,
}) => {
  const dayRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);
  const currentDayIndex = getCurrentDayIndex();

  useEffect(() => {
    if (currentDayIndex !== null && dayRefs.current[currentDayIndex]) {
      dayRefs.current[currentDayIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentDayIndex]);

  const finalData = useMemo(() => {
    if (data && Object.keys(data.timetable || {}).length > 0) return data;
    return null;
  }, [data]);

  if (!finalData) {
    return null;
  }

  return (
    <Table
      withBorder
      striped
      highlightOnHover
      horizontalSpacing="sm"
      verticalSpacing="xs"
      fontSize="xs"
      sx={{
        minWidth: "100%",
        overflowX: "auto",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              position: "sticky",
              left: 0,
              top: 0,
              zIndex: 3,
              background: "#fff",
              boxShadow: "2px 0 2px -1px #0001",
            }}
          >
            <Text weight={500} size="xs">
              Period
            </Text>
          </th>
          {days.map((day, idx) => (
            <th
              key={day}
              ref={(el) => (dayRefs.current[idx] = el)}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                textAlign: "center",
                backgroundColor:
                  idx === currentDayIndex ? studentProfileColor + "22" : "#fff",
                transition: "background 0.3s",
              }}
            >
              <Text
                color={idx === currentDayIndex ? studentProfileColor : "gray.7"}
                weight={500}
                size="xs"
              >
                {day}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(finalData.timetable).map(([period, schedule]) => (
          <tr key={period}>
            <td
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                background: "#fff",
                boxShadow: "2px 0 2px -1px #0001",
              }}
            >
              <Text weight={700} color="dark" align="center" size="xs">
                {period}
              </Text>
            </td>
            {days.map((day, idx) => (
              <td
                key={day}
                style={{
                  padding: 6,
                  backgroundColor:
                    idx === currentDayIndex
                      ? studentProfileColor + "22"
                      : undefined,
                  transition: "background 0.3s",
                  minWidth : 150,
                }}
              >
                <TimetableCell
                  entry={schedule[day]}
                  studentProfileColor={studentProfileColor}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Timetable;
