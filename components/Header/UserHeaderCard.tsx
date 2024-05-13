import cx from 'clsx';
import { Avatar, Group, Menu, Text, UnstyledButton, rem, useMantineTheme } from '@mantine/core';
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';
import classes from '@/styles/HeaderMegaMenu.module.css';

const user = {
  name: 'Jane Spoonfighter',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

export const UserHeaderCard = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group gap={7}>
            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.name}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          }
        >
          Liked posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconStar
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          }
        >
          Saved posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconMessage
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.blue[6]}
              stroke={1.5}
            />
          }
        >
          Your comments
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Account settings
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Change account
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Logout
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={<IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Pause subscription
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Delete account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
