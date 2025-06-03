import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useAttendanceEvents } from "../queries/useAttendanceDate";
import { useGetAcademicYearMonth } from "../queries/useGetAcademicYearMonth";
import { capitalizeFirstLetter } from "../../utility/capitalizeFirstChar";

interface AttendanceCalendarProps {
  selectedStudentId: string;
  students: StudentValues[];
}

interface StudentValues {
  first_name: string;
  student_name?: string;
  name: string;
  program?: string;
}

interface MonthDetails {
  month_name: string;
  month_number: number;
  year: number;
  month_start: string;
  month_end: string;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  students,
  selectedStudentId,
}) => {
  const [attendance, setAttendance] = useState<
    { title: string; date: string; color: string }[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentValues | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [monthDetails, setMonthDetails] = useState<MonthDetails[] | null>(null);

  useEffect(() => {
    const foundStudent =
      students.find((s) => s.name === selectedStudentId) || null;
    setSelectedStudent(foundStudent);
  }, [students, selectedStudentId]);

  const {
    data: events,
    isLoading,
    isError,
  } = useAttendanceEvents(
    selectedStudent?.name || "",
    currentMonth + 1,
    currentYear,
    selectedStudent?.program || ""
  );

  const { data: academicYearMonths } = useGetAcademicYearMonth(
    selectedStudent?.name || ""
  );

  const totalAbsentDays =
    academicYearMonths?.message?.data?.total_absences || 0;

  useEffect(() => {
    if (academicYearMonths?.message?.data) {
      setMonthDetails(academicYearMonths?.message?.data?.months);
    }
  }, [academicYearMonths, monthDetails]);

  useEffect(() => {
    if (events) {
      setAttendance(events);
    }
  }, [events]);

  if (isLoading) {
    return (
      <Text align="center" color="dimmed" weight="bold" my={30}>
        Loading...
      </Text>
    );
  }

  if (isError) {
    <Text align="center" color="dimmed" weight="bold" my={30}>
      Error fetching attendance data
    </Text>;
  }

  return (
    <Flex style={{ flexDirection: "column" }}>
      <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
        <strong>Total Absent Days:</strong> {totalAbsentDays}
      </h3>
      <Flex align="center" mb={10} wrap="wrap" gap={15}>
        <Flex align="center" gap={5}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "var(--walsh-warning)" /* Yellow for pending */,
              borderRadius: "3px",
            }}
          ></div>
          <Text size="sm">Pending</Text>
        </Flex>
        <Flex align="center" gap={5}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "var(--walsh-red)" /* Red for rejected */,
              borderRadius: "3px",
            }}
          ></div>
          <Text size="sm">Rejected</Text>
        </Flex>
        <Flex align="center" gap={5}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "var(--walsh-success)" /* Green for approved */,
              borderRadius: "3px",
            }}
          ></div>
          <Text size="sm">Approved</Text>
        </Flex>
      </Flex>
      <Flex
        gap={8}
        py={8}
        sx={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {monthDetails?.map((month) => (
          <Button
            key={`${month.month_name}-${month.year}`}
            variant={
              currentMonth === month.month_number - 1 &&
              currentYear === month.year
                ? "filled"
                : "outline"
            }
            style={{
              backgroundColor:
                currentMonth === month.month_number - 1 &&
                currentYear === month.year
                  ? "var(--walsh-primary)"
                  : "transparent",
              borderColor: "var(--walsh-primary)",
              color:
                currentMonth === month.month_number - 1 &&
                currentYear === month.year
                  ? "var(--walsh-white)"
                  : "var(--walsh-primary)",
            }}
            onClick={() => {
              setCurrentMonth(month.month_number - 1);
              setCurrentYear(month.year);
            }}
          >
            {month.month_name}
          </Button>
        ))}
      </Flex>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        key={`${currentYear}-${currentMonth}`}
        events={attendance}
        height="auto"
        initialDate={dayjs(new Date(currentYear, currentMonth, 1)).format(
          "YYYY-MM-DD"
        )}
        titleFormat={{ month: "short", year: "numeric" }}
        headerToolbar={{
          left: "title",
          center: "",
          right: "",
        }}
        eventContent={(eventInfo) => {
          const eventColor = eventInfo.event.extendedProps.color;
          return (
            <div
              style={{
                backgroundColor: eventColor,
                color: "white",
                padding: "2px 5px",
                borderRadius: "3px",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {capitalizeFirstLetter(eventInfo.event.title)}
            </div>
          );
        }}
        dayCellContent={(cellInfo) => (
          <div style={{ cursor: "default" }}>{cellInfo.dayNumberText}</div>
        )}
      />
    </Flex>
  );
};

export default AttendanceCalendar;
