'use client';
import { Group, Box, Burger, Drawer, Title, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/styles/HeaderMegaMenu.module.css';
import { UserHeaderCard } from './UserHeaderCard';

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Title order={2}>Cloudease</Title>
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
}
