'use client';
import { ProjectCard, ProjectCardProps } from '@/components/ProjectCard';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { Box, Button, Container, Group, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [projects, setProjects] = useState<Array<ProjectCardProps>>([]);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get(ApiRoutes.project.getAll());
      const data = response.data;
      setProjects(data.data.projects);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
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
      <Group justify="center" pt={'lg'}>
        <Group maw={720} justify="space-between">
          {projects.length ? (
            projects.map((project) => <ProjectCard key={project.projectId} {...project} />)
          ) : (
            <Title fw={400} order={6}>
              Oops! No projects found.
            </Title>
          )}
        </Group>
      </Group>
    </Container>
  );
}
