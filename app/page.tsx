'use client';
import { ProjectCard, ProjectCardProps } from '@/components/ProjectCard';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { Button, Container, Group, Loader, TextInput, Title, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [projects, setProjects] = useState<Array<ProjectCardProps>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<number>(-1);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get(ApiRoutes.project.getAll());
      const data = response.data;
      setProjects(data.data.projects);
      return data.data.projects as Array<ProjectCardProps>;
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.clearTimeout(timeoutRef.current);

    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery.trim().length !== 0) {
      setLoading(true);
      timeoutRef.current = window.setTimeout(async () => {
        const pts = await fetchProjects();

        if (!pts) return;
        const filteredProjects = pts.filter((project) => {
          const q1 = project.projectId.toLowerCase().includes(searchQuery);
          const q2 = project.projectDescription.toLowerCase().includes(searchQuery);
          const q3 = project.projectName.toLowerCase().includes(searchQuery);
          const q4 = project.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
          return q1 || q2 || q3 || q4;
        });
        setProjects(filteredProjects);
        setLoading(false);
      }, 1000);
    } else {
      fetchProjects();
    }
  };
  return (
    <Container p={'sm'}>
      <Group justify="space-between" h="100%">
        <Title fw={400} order={3}>
          My Projects
        </Title>
        <TextInput
          radius="xl"
          size="md"
          placeholder="Search projects"
          onChange={handleChange}
          rightSectionWidth={42}
          leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        />
        <Button onClick={() => router.push('/create-new-project')} radius="md">
          Create new project
        </Button>
      </Group>
      <Group justify="center" pt={'lg'}>
        <Group maw={720} justify="space-between">
          {loading ? (
            <Loader type="bars" size="sm" />
          ) : projects.length ? (
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
