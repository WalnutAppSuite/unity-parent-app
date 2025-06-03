import React, { useEffect, useState } from "react";
import {
  Box,
  TextInput,
  Button,
  Text,
  Paper,
  Group,
  Title,
  Space,
  Select,
  Modal,
} from "@mantine/core";
import { useDetailsList } from "../queries/useGuardianList";
import useLeaveNote from "../queries/useLeaveNoteMutation";
import useEarlyPickUpMutation from "../queries/useEarlyPickUpMutation";
import { useNotification } from "@refinedev/core";

interface FormData {
  reason: string;
  fromDate?: string;
  toDate?: string;
  time?: string;
  guardian: string;
  student: string;
  program: string;
  guardian_id: string;
}

interface StudentValues {
  first_name: string;
  student_name?: string;
  name: string;
  program?: string;
}

interface Guardian {
  name: string;
  guardian_name: string;
}

interface LeaveNoteFormProps {
  subject: "leave" | "early-pickup" | "late-arrival";
  students: StudentValues[];
  selectedStudent: string;
  bgColor: string;
}

const LeaveNoteForm: React.FC<LeaveNoteFormProps> = ({
  subject,
  students,
  selectedStudent,
  bgColor,
}) => {
  const today = new Date().toLocaleDateString("en-GB").split("/").join("-");

  const currentDate = new Date().toISOString().split("T")[0];

  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<FormData>({
    reason: "",
    fromDate: "",
    toDate: "",
    time: "",
    guardian_id: "",
    guardian: "",
    student: "",
    program: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const handlePreview = (): void => {
    setPreviewOpen(true);
  };

  const { data: details_list } = useDetailsList(selectedStudent);

  const {
    mutateAsync: lateMutateAsync,
    isLoading: lateIsLoading,
    isError: lateIsError,
  } = useLeaveNote();

  const {
    mutateAsync: earlyMutateAsync,
    isLoading: earlyIsLoading,
    isError: earlyIsError,
  } = useEarlyPickUpMutation();

  const { open } = useNotification();

  const guardians = details_list?.data?.message?.guardians || [];

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.reason || !formData.fromDate || !formData.guardian_id) {
      return;
    }

    try {
      if (subject === "leave") {
        if (!formData.toDate) {
          return;
        }

        const dates = [];
        const from = new Date(formData.fromDate);
        const to = new Date(formData.toDate);
        const delay = new Date().getTimezoneOffset();

        from.setMinutes(from.getMinutes() - delay);
        to.setMinutes(to.getMinutes() - delay);

        for (let i = from; i <= to; i.setDate(i.getDate() + 1)) {
          dates.push(i.toISOString().split("T")[0]);
        }

        await lateMutateAsync({
          student: selectedStudent,
          dates: dates,
          note: formData.reason,
          start_date: dates[0],
          end_date: dates[dates.length - 1],
          program: formData.program,
          guardian: formData.guardian_id,
          status: "leave",
        });
      } else if (subject === "early-pickup" || subject === "late-arrival") {
        if (!formData.time) {
          return;
        }

        const status = subject === "early-pickup" ? "early" : "late";
        const date = new Date(formData.fromDate);
        date.setMinutes(date.getMinutes() - new Date().getTimezoneOffset());

        await earlyMutateAsync({
          student: selectedStudent,
          date: date.toISOString().split("T")[0],
          note: formData.reason,
          status: status,
          time: formData.time,
          program: formData.program,
          guardian: formData.guardian_id,
        });
      }

      open?.({
        type: "success",
        message: "Form submitted successfully",
      });

      clearForm();
    } catch (error) {
      setErrorMsg("An error occurred while submitting. Please try again.");
    }
  };

  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      reason: "",
      fromDate: "",
      toDate: "",
      time: "",
      guardian_id: "",
      guardian: "",
    }));
  };

  const subjectText =
    subject === "leave"
      ? "Leave Application"
      : subject === "early-pickup"
      ? "Early Pickup Request"
      : "Late Arrival Request";

  useEffect(() => {
    const foundStudent = students.find((s) => s.name === selectedStudent);

    setFormData((prev) => ({
      ...prev,
      student: selectedStudent,
      program: foundStudent?.program || "",
    }));

    setSelectedStudentName(foundStudent?.student_name || "");
  }, [students, selectedStudent]);

  if (lateIsLoading || earlyIsLoading) {
    return (
      <Text align="center" color="dimmed" weight="bold" my={30}>
        Loading...
      </Text>
    );
  }

  if (lateIsError || earlyIsError) {
    return (
      <Text align="center" color="dimmed" weight="bold" my={30}>
        {errorMsg}
      </Text>
    );
  }

  return (
    <>
      <Modal
        opened={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Preview Application"
        centered
      >
        <Text fw={500}>Subject: {subjectText}</Text>
        <Text>Date: {today}</Text>
        <Text>Dear Principal Ma'am,</Text>
        <Text>
          My ward {selectedStudentName || "______"}{" "}
          {subject === "leave"
            ? "will not be attending school as"
            : subject === "early-pickup"
            ? "needs to leave school early due to"
            : "will be arriving late due to"}{" "}
          {formData.reason}
        </Text>

        {subject === "leave" && (
          <Text>
            From: {formData.fromDate} To: {formData.toDate}
          </Text>
        )}
        {(subject === "early-pickup" || subject === "late-arrival") && (
          <Text>
            {subject === "early-pickup" ? "Pickup Time" : "Arrival Time"}:{" "}
            {formData.time}
          </Text>
        )}
        <Text>Warm regards,</Text>
        <Text>Guardian</Text>
        <Text>{formData.guardian}</Text>
      </Modal>

      <Paper withBorder p="md" radius="sm" shadow="xs" mx="auto">
        <Box component="form" onSubmit={handleSubmit}>
          <Title order={5} fw={500}>
            Subject: {subjectText}
          </Title>
          <Text fw={500} mt="md">
            Date: {today}
          </Text>
          <Text mt="md" fw={500}>
            Dear Principal Ma'am,
          </Text>

          <Text mt="md">
            My ward {selectedStudentName || "______"}{" "}
            {subject === "leave"
              ? "will not be attending school as"
              : subject === "early-pickup"
              ? "needs to leave school early due to"
              : "will be arriving late due to"}
          </Text>
          <TextInput
            placeholder="Enter the reason here"
            mt="xs"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            required
          />

          {subject === "leave" && (
            <Group mt="md" align="center">
              <Text>My ward will not be attending school from</Text>
              <TextInput
                type="date"
                w={130}
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fromDate: e.target.value }))
                }
                min={currentDate}
                required
              />
              <Text>to</Text>
              <TextInput
                type="date"
                w={130}
                value={formData.toDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, toDate: e.target.value }))
                }
                min={formData.fromDate}
                required
              />
            </Group>
          )}

          {(subject === "early-pickup" || subject === "late-arrival") && (
            <Group mt="md" align="center">
              <Text>
                My ward{" "}
                {subject === "early-pickup"
                  ? "needs to leave school on"
                  : "will be arriving late on"}
              </Text>
              <TextInput
                type="date"
                w={130}
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fromDate: e.target.value }))
                }
                min={currentDate}
                required
              />
              <Text>at</Text>
              <TextInput
                type="time"
                w={130}
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                required
              />
            </Group>
          )}

          <Group
            mt="md"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text>Warm regards,</Text>
            <Group
              spacing="xs"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text>Submitted by Guardian</Text>
              <Select
                w={180}
                placeholder="Select Guardian"
                data={
                  guardians.map((guardian: Guardian) => ({
                    value: guardian.name,
                    label: guardian.guardian_name,
                  })) || []
                }
                value={formData.guardian_id}
                onChange={(value) => {
                  const selectedGuardian = guardians.find(
                    (guardian: Guardian) => guardian.name === value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    guardian_id: value || "",
                    guardian: selectedGuardian
                      ? selectedGuardian.guardian_name
                      : "",
                  }));
                }}
                required
                styles={(theme) => ({
                  root: {
                    width: "100%",
                  },
                  input: {
                    height: "48px",
                    fontSize: "16px",
                    padding: "0 14px",
                    borderColor: theme.colors.gray[4],
                    // "&:focus": {
                    //   borderColor: bgColor,
                    // },
                  },
                  rightSection: {
                    paddingRight: "12px",
                  },
                  item: {
                    padding: "12px 14px",
                    fontSize: "16px",
                    "&[data-selected]": {
                      backgroundColor: bgColor,
                      color: "white",
                    },
                    "&[data-hovered]": {
                      backgroundColor: theme.fn.lighten(bgColor, 0.2),
                    },
                  },
                  dropdown: {
                    padding: "8px 0",
                    borderRadius: theme.radius.sm,
                    maxHeight: "300px",
                  },
                })}
              />
            </Group>
          </Group>

          <Space h="md" />
          <Group mt="lg" position="apart">
            <Button
              type="button"
              style={{
                color: bgColor,
                backgroundColor: "white",
                border: `1px solid ${bgColor}`,
              }}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button type="submit" style={{ backgroundColor: bgColor }}>
              Submit
            </Button>
          </Group>
        </Box>
      </Paper>
    </>
  );
};

export default LeaveNoteForm;
