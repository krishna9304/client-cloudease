'use client';
import { Group, Box, Burger, Drawer, Title, Divider, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/styles/HeaderMegaMenu.module.css';
import { UserHeaderCard } from './UserHeaderCard';
import { useRouter } from 'next/navigation';

export const HeaderMegaMenu: React.FC<{ playgroundText: string }> = ({ playgroundText }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        height: '100%',
      }}
    >
      <header
        style={{
          height: playgroundText.length > 0 ? '80px' : '60px',
        }}
        className={classes.header}
      >
        <Group justify="space-between" h="100%">
          <Title style={{ cursor: 'pointer' }} onClick={() => router.push('/')} order={2}>
            Cloudease
            <div
              style={{
                color: theme.colors['ui-primary'][0],
                fontSize: '0.8rem',
              }}
            >
              {playgroundText}
            </div>
          </Title>
          <UserHeaderCard />
          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={<Title order={2}>Cloudease</Title>}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider size={'sm'} />
      </Drawer>
    </Box>
  );
};
