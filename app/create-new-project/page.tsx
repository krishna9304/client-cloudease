'use client';
import { CreateNewProjectForm } from '@/components/CreateNewProject';
import { Box, Container, Group, Title, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function CreateNewProjectPage() {
  const router = useRouter();
  return (
    <Container p={'sm'}>
      <Group justify="space-between" h="100%">
        <Title fw={400} order={3}>
          Create new project
        </Title>
      </Group>
      <Box
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        pt={'lg'}
      >
        <IconArrowLeft style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        <p style={{ fontSize: '15px' }}>Back</p>
      </Box>
      <Box pt={'lg'}>
        <CreateNewProjectForm />
      </Box>
    </Container>
  );
}
