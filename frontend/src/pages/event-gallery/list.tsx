import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Card, Group, Image, SimpleGrid, Text, Title } from "@mantine/core";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor.ts";
import useEvents from "../../components/queries/useEvents.ts";

const EventList = () => {
  const [searchParams] = useSearchParams();
  const folder = searchParams.get("folder") || "";
  const student = searchParams.get("student") || "";
  const navigate = useNavigate();
  
  const studentProfileColor = useStudentProfileColor(student);
  const { data, isLoading, isError } = useEvents(folder, student);

  // With the updated React Query hook, data is directly the array of events
  const events = Array.isArray(data) ? data : [];

  if (isLoading) {
    return <Text align="center" my={30}>Loading events...</Text>;
  }

  if (isError) {
    return <Text align="center" color="red" my={30}>Error loading events</Text>;
  }

  if (events.length === 0) {
    return <Text align="center" my={30}>No events found in this folder</Text>;
  }
  
  return (
    <Box p="md">
      <Title order={3} mb="md" color={studentProfileColor}>
        {folder} Events
      </Title>
      
      <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {events.map((event) => (
          <Card 
            key={event.id} 
            shadow="sm" 
            p="lg" 
            radius="md" 
            withBorder
            sx={{ 
              cursor: 'pointer',
              '&:hover': { 
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-5px)',
                transition: 'all 0.2s ease'
              }
            }}
            onClick={() => navigate(`/event-gallery/event-detail?eventId=${event.id}&student=${student}&folder=${folder}`)}
          >
            <Card.Section>
              <Image
                src={event.thumbnail}
                height={160}
                alt={event.title}
              />
            </Card.Section>
            
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500} color={studentProfileColor}>{event.title}</Text>
            </Group>
            
            <Text size="sm" color="dimmed" mb="md">
              {event.description}
            </Text>
            
            <Group position="apart">
              <Text size="xs" color="gray">{event.date}</Text>
              <Text size="xs" color={studentProfileColor}>{event.imageCount} photos</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default EventList;