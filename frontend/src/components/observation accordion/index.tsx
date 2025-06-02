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
      scorePercentage >= 80 ? "#15803d" :
      scorePercentage >= 60 ? "#65a30d" :
      scorePercentage >= 40 ? "#d97706" :
      scorePercentage >= 20 ? "#dc2626" : "#b91c1c";

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
            </Box>

            {observation.Table.map((record) => (
              <Box
                key={record.name}
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
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
              </Box>
            ))}
          </Box>
        )}

        <Text size="sm" color="#555" mb={12} style={{ lineHeight: 1.5 }}>
          {observation.remarks}
        </Text>
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
                {observations.map((observation) => {
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

                  return (
                    <Badge
                      key={observation.name}
                      size="lg"
                      variant="light"
                      style={{
                        border: `2px solid ${borderColor}`,
                        borderRadius: "999px",
                        backgroundColor: bgColor,
                        color: borderColor,
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
            {observations.map((observation) => (
              <Box key={observation.name}>{renderBody(observation)}</Box>
            ))}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ObservationAccordion;