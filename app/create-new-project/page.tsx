'use client';
import { CreateNewProjectForm } from '@/components/CreateNewProject';
import { Box, Container, Group, Title, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateNewProjectPage() {
  const [headerName, setHeaderName] = useState<string>('Create new project');
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    if (queryParams.has('project')) {
      setHeaderName('Edit project');
    }
  }, [queryParams]);
  return (
    <Container p={'sm'}>
      <Group justify="space-between" h="100%">
        <Title fw={400} order={3}>
          {headerName}
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
