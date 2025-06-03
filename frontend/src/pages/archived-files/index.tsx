import { Flex, Box, Text, Center, Alert, Loader } from "@mantine/core";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import useStudentList from "../../components/queries/useStudentList";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor";
import ArchivedFilesCard from "../../components/archived files card";
import {
  useStudentDocs,
  processFileData,
} from "../../components/queries/useStudentDoc";
import { useState } from "react";

interface Student {
  first_name: string;
  name: string;
}

interface ProcessedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export default function ArchivedFiles(): JSX.Element {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const pageSize = 10;
  const loadingRef = useRef<IntersectionObserver | null>(null);

  const {
    data: studentsList,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useStudentList();

  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useStudentDocs(selectedStudent, pageSize);

  const students = useMemo<Student[]>(
    () => studentsList?.data?.message || [],
    [studentsList?.data]
  );

  const files = useMemo<ProcessedFile[]>(
    () => filesData?.pages.flatMap((page) => page.map(processFileData)) || [],
    [filesData]
  );

  const studentProfileColor = useStudentProfileColor(selectedStudent);

  const observer = useCallback(
    (node: HTMLDivElement | null) => {
      if (filesLoading || isFetchingNextPage) return;
      if (loadingRef.current) loadingRef.current.disconnect();

      loadingRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
      });

      if (node) loadingRef.current.observe(node);
    },
    [filesLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0].name);
    }
  }, [students, selectedStudent]);

  if (studentsLoading) {
    return (
      <Center h="100vh">
        <Flex direction="column" align="center" gap="md">
          <Text size="md">Loading...</Text>
        </Flex>
      </Center>
    );
  }

  if (studentsError || filesError) {
    return (
      <Center h="100vh" p="md">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
          w="100%"
          maw={500}
        >
          Failed to load data. Please try again later.
        </Alert>
      </Center>
    );
  }

  return (
    <div>
      <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
        <Flex>
          {students.map((student, index) => {
            const isSelected = selectedStudent === student.name;
            return (
              <Box
                key={student.name}
                sx={{
                  display: "inline-block",
                  marginTop: 10,
                  flexShrink: 0,
                  flexGrow: 1,
                  textAlign: "center",
                  minWidth: "33.33%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedStudent(student.name)}
              >
                <Text
                  sx={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderLeft: index ? "1px solid black" : "none",
                    color: isSelected ? "black" : "#0007",
                  }}
                >
                  {student.first_name}
                </Text>
                <Box
                  sx={{
                    marginTop: isSelected ? 4 : 5,
                    borderBottom: isSelected
                      ? `2px solid ${studentProfileColor}`
                      : "1px solid #0005",
                  }}
                />
              </Box>
            );
          })}
        </Flex>
      </Box>

      <Flex direction="column" align="center" p="xl">
        {files.length > 0 ? (
          <>
            <Flex wrap="wrap" gap="md" justify="center" w="100%">
              {files.map((file, index) => (
                <ArchivedFilesCard key={`${file.name}-${index}`} item={file} />
              ))}
            </Flex>

            <div
              ref={observer}
              style={{ width: "100%", padding: "20px", textAlign: "center" }}
            >
              {isFetchingNextPage && <Loader size="sm" />}
            </div>
          </>
        ) : !filesLoading ? (
          <Text color="dimmed" size="lg">
            No files found for this student
          </Text>
        ) : null}
      </Flex>
    </div>
  );
}
