import { Card, Text, Group, Badge, Button } from '@mantine/core';
import classes from './ProjectCard.module.css';

const mockdata = {
  title: 'Verudela Beach',
  description:
    'Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.',
  badges: [
    { emoji: '☀️', label: 'Sunny weather' },
    { emoji: '🦓', label: 'Onsite zoo' },
  ],
};

export function ProjectCard() {
  const { title, description, badges } = mockdata;
  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section}>
        <Group justify="apart">
          <Text fz="lg" fw={700}>
            {title}
          </Text>
        </Group>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group display="flex" justify="center" align="center" gap={7}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Edit
        </Button>
      </Group>
    </Card>
  );
}
