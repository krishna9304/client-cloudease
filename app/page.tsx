'use client';
import { ProjectCard } from '@/components/ProjectCard';
import { Box, Button, Container, Group, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  return (
    <Container p={'sm'}>
      <Group justify="space-between" h="100%">
        <Title fw={400} order={3}>
          My Projects
        </Title>

        <Button onClick={() => router.push('/create-new-project')} radius="md">
          Create new project
        </Button>
      </Group>
      <Box pt={'lg'}>
        <ProjectCard />
      </Box>
    </Container>
  );
}
