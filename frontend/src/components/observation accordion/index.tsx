import { Accordion, Box, Text, Group, Badge, Flex } from "@mantine/core";
import { useState } from "react";

import { Observation } from "../queries/useObservation.ts";

interface CustomAccordionProps {
  subject: string;
  observations: Observation[];
}

const ObservationAccordion = ({
  subject,
  observations,
}: CustomAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderBody = (observation: Observation) => {
    const boxStyle = {
      padding: "8px",
      borderRadius: "8px",
      backgroundColor: "#fafafa",
      border: "1px solid #eeeeee",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.2s ease",
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
      <Box style={boxStyle} key={observation.name}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text weight={600} style={{ fontSize: "16px", color: "#333" , display: "flex", alignItems: "center" }}>
            {observation.observation_type}
          </Text>
          <Text weight={600} style={{ fontSize: "16px", color: "#333" , display: "flex", alignItems: "center" , gap: "4px" }}>
            Avg:
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
          </Text>
        </Flex>

        {observation.remarks && (
          <Text size="sm" color="#555" mb={12} style={{ lineHeight: 1.5 }}>
            {observation.remarks}
          </Text>
        )}

        {/* Table Section */}
        {observation.Table && observation.Table.length > 0 && (
          <Box mt={8}>
            <Box style={{ marginBottom: 12, overflowX: "scroll", borderRadius: 0 }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      border: "2px solid #eeeeee",
      borderRadius: 4,
      overflow: "hidden",
      background: "#fff",
    }}
  >
    <tbody>
      <tr>
        <th
          style={{
            textAlign: "left",
            padding: "8px 12px",
            background: "#fff",
            borderRight: "2px solid #eeeeee",
            borderBottom: "2px solid #eeeeee",
            minWidth: 120,
          }}
        >
          Period No.
        </th>
        {observation.Table.map((record: any, idx: number) => (
          <td
            key={idx}
            style={{
              textAlign: "center",
              padding: "8px 12px",
              borderBottom: "2px solid #eeeeee",
              borderRight:
                idx === observation.Table.length - 1
                  ? undefined
                  : "2px solid #eeeeee",
              fontSize: 18,
              whiteSpace: "nowrap",
            }}
          >
            {record.period_number}
          </td>
        ))}
      </tr>
      <tr>
        <th
          style={{
            textAlign: "left",
            padding: "8px 12px",
            background: "#fff",
            borderRight: "2px solid #eeeeee",
            minWidth: 120,
          }}
        >
          Grade
        </th>
        {observation.Table.map((record: any, idx: number) => (
          <td
            key={idx}
            style={{
              textAlign: "center",
              padding: "8px 12px",
              borderRight:
                idx === observation.Table.length - 1
                  ? undefined
                  : "2px solid #eeeeee",
              fontSize: 18,
              whiteSpace: "nowrap",
            }}
          >
            {record.grade}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</Box>
          </Box>
        )}
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
            padding: "10px",
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
                  const scorePercentage =
                    observation.total_marks > 0
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

        <Accordion.Panel style={{ backgroundColor: "#fcfcfc", padding: 8 }}>
          <Flex direction="column" gap={8}>
            {observations.map((observation) => renderBody(observation))}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ObservationAccordion;
