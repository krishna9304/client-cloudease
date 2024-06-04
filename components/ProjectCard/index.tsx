import { Card, Text, Group, Badge, Button } from '@mantine/core';
import classes from './ProjectCard.module.css';
import { useRouter } from 'next/navigation';
import { IconEdit } from '@tabler/icons-react';

export interface ProjectCardProps {
  projectId: string;
  projectName: string;
  projectDescription: string;
  tags: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  projectName,
  projectDescription,
  tags,
}) => {
  const router = useRouter();
  const features = tags.map((badge) => (
    <Badge variant="light" key={badge}>
      {badge}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section}>
        <Group justify="apart">
          <Text fz="lg" fw={700}>
            {projectName}
          </Text>
        </Group>
        <Text h={200} fz="sm" mt="xs">
          {projectDescription.length > 60
            ? projectDescription.split(' ').slice(0, 60).join(' ') + '...'
            : projectDescription}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group display="flex" justify="center" align="center" gap={7}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button
          onClick={() => router.push(`/playground/design?project=${projectId}`)}
          radius="md"
          style={{ flex: 1 }}
        >
          Go to playground
        </Button>
        <Button
          variant="gradient"
          onClick={() => router.push(`/create-new-project?project=${projectId}`)}
          radius="md"
        >
          <IconEdit size={18} /> Edit details
        </Button>
      </Group>
    </Card>
  );
};
