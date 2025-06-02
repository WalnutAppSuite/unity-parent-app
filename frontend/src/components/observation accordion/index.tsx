import { Accordion, Box, Text, Group, Badge, Flex } from "@mantine/core";
import { useState } from "react";
import { Observation } from "../queries/useObservation.ts";

interface CustomAccordionProps {
  subject: string;
  observations: Observation[];
}

const ObservationAccordion = (data: CustomAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { subject, observations } = data;

  const renderBody = (observation: Observation) => {
    const boxStyle = {
      padding: "18px",
      borderRadius: "10px",
      backgroundColor: "#fafafa",
      border: "1px solid #eeeeee",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.2s ease",
      "&:hover": {
        boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
      },
    };

    const scorePercentage = (observation.marks / observation.total_marks) * 100;
    const scoreColor =
      scorePercentage >= 60
        ? "#15803d"
        : scorePercentage >= 40
          ? "#d97706"
          : scorePercentage >= 20
            ? "#dc2626"
            : "#b91c1c";

    return (
      <Box style={boxStyle}>
        <Flex justify="space-between" align="center" mb={10}>
          <Text weight={600} style={{ fontSize: "16px", color: "#333" }}>
            {observation.observation_type}
          </Text>
          <Text
            weight={700}
            style={{
              fontSize: "16px",
              color: scoreColor,
              backgroundColor: `${scoreColor}15`,
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            {observation.marks} / {observation.total_marks}
          </Text>
        </Flex>

        {/* Period Table */}
        {observation.Table && observation.Table.length > 0 && (
          <Box
            mb={12}
            style={{
              overflow: "hidden",
              borderRadius: "8px",
              border: "1px solid #eeeeee",
            }}
          >
            <Box
              style={{
                padding: "10px 12px",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #eeeeee",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* <Text size="sm" weight={600} style={{ flex: '1.5', color: '#444' }}>Date</Text> */}
              <Text
                size="sm"
                weight={600}
                style={{ flex: "1", color: "#444", textAlign: "center" }}
              >
                Period
              </Text>
              <Text
                size="sm"
                weight={600}
                style={{ flex: "1", color: "#444", textAlign: "center" }}
              >
                Grade
              </Text>
              {/* <Text size="sm" weight={600} style={{ flex: "3", color: "#444" }}>
                Remarks
              </Text> */}
            </Box>

            {observation.Table.map((record) => {
              return (
                <Box
                  key={record.name}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Text size="sm" style={{ flex: '1.5', color: '#555' }}>{formattedDate}</Text> */}
                  <Text
                    size="sm"
                    style={{ flex: "1", color: "#555", textAlign: "center" }}
                  >
                    {record.period_number}
                  </Text>
                  <Text
                    size="sm"
                    style={{ flex: "1", color: "#555", textAlign: "center" }}
                  >
                    {record.grade}
                  </Text>
                  {/* <Text size="sm" style={{ flex: "3", color: "#555" }}>
                    {record.remarks}
                  </Text> */}
                </Box>
              );
            })}
          </Box>
        )}

        {<Box

          interface Observation {
    name: string;
        subject: string;
        observation_type: string;
        observation_label: string;
        marks: number;
        scale: number;
        remarks: string;
        grade?: string;
        date?: string;
        class_average: number;
        division_average: number;
        total_marks: number;
}

        interface CustomAccordionProps {
          subject: string;
        observations: Observation[];
}

const ObservationAccordion = (data: CustomAccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);
        const {subject, observations} = data;

    const renderBody = (observation: Observation) => {
        // Enhanced box style with visual hierarchy
        const boxStyle = {
          padding: "18px",
        borderRadius: "10px",
        backgroundColor: "#fafafa",
        border: "1px solid #eeeeee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 3px 10px rgba(0,0,0,0.06)"
            }
        };

        // Determine the score percentage for visual indication
        const scorePercentage = (observation.division_average / observation.total_marks) * 100;
        const scoreColor = 
            scorePercentage >= 80 ? "#15803d" :
            scorePercentage >= 60 ? "#65a30d" :
            scorePercentage >= 40 ? "#d97706" :
            scorePercentage >= 20 ? "#dc2626" :
        "#b91c1c";

        return (
        <Box style={boxStyle}>
          {/* Primary information highlighted */}
          <Flex justify="space-between" align="center" mb={10}>
            <Text weight={600} style={{ fontSize: "16px", color: "#333" }}>
              {observation.observation_type}
            </Text>
            <Text
              weight={700}
              style={{
                fontSize: "16px",
                color: scoreColor,
                backgroundColor: `${scoreColor}15`,
                padding: "4px 10px",
                borderRadius: "6px"
              }}
            >
              {observation.division_average} / {observation.total_marks}
            </Text>
          </Flex>

          {/* Secondary information */}
          <Text size="sm" color="#555" mb={12} style={{ lineHeight: 1.5 }}>
            {observation.remarks}
          </Text>

          {/* Tertiary information with subtle styling */}
          <Box
            style={{
              backgroundColor: "#f0f0f0",
              padding: "8px 12px",
              borderRadius: "6px"
            }}
          >
            <Text size="sm" color="#666">
              Class Average Score: <span style={{ fontWeight: 600, color: "#444" }}>{observation.class_average}</span>
            </Text>
          </Box> }
        </Box>
        );
  };

        return (
        <Accordion
          variant="separated"
          value={isOpen ? subject : null}
          onChange={(value) => setIsOpen(value === subject)}
          style={{
            border: "1px solid #eaeaea",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <Accordion.Item value={subject} style={{ border: "none" }}>
            <Accordion.Control
              style={{
                backgroundColor: "#ffffff",
                padding: "18px",
                borderBottom: isOpen ? "1px solid #eaeaea" : "none",
              }}
            >
              <Group position="apart" style={{ width: "100%" }}>
                <Text
                  size="lg"
                  weight={700}
                  style={{
                    color: "#111",
                    letterSpacing: "-0.01em",
                    fontSize: "18px",
                  }}
                >
                  {subject}
                </Text>

                {!isOpen && (
                  <Group spacing={10}>
                    {observations.map((observation: Observation) => {
                      const scorePercentage = observation.total_marks > 0
                        ? (observation.marks / observation.total_marks) * 100
                        : 0;

                      const borderColor =
                        scorePercentage >= 60
                          ? "#15803d"
                          : scorePercentage >= 40
                            ? "#d97706"
                            : scorePercentage >= 20
                              ? "#dc2626"
                              : "#b91c1c";

                      const bgColor =
                        scorePercentage >= 60
                          ? "#f0fdf4"
                          : scorePercentage >= 40
                            ? "#fef3c7"
                            : scorePercentage >= 20
                              ? "#fee2e2"
                              : "#fecaca";

                      const textColor = borderColor;

                      return (
                        <Badge
                          key={observation.name}
                          size="lg"
                          variant="light"
                          style={{
                            border: `2px solid ${borderColor}`,
                            borderRadius: "999px",
                            backgroundColor: bgColor,
                            color: textColor,
                            height: "42px",
                            width: "42px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "15px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          }}
                        >
                          {observation.observation_label}
                        </Badge>
                      );
                    })}
                  </Group>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel style={{ backgroundColor: "#fcfcfc" }}>
              <Flex direction="column" gap={16} p={16}>
                {observations.map((observation: Observation) => (
                  <Box key={observation.name}>{renderBody(observation)}</Box>
                ))}
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        );
};

        export default ObservationAccordion;