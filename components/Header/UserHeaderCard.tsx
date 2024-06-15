import cx from 'clsx';
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconClick,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import { useState } from 'react';
import classes from '@/styles/HeaderMegaMenu.module.css';
import { useCurrentUser } from '@/store/user.store';
import toast from 'react-hot-toast';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { useRouter } from 'next/navigation';

export const UserHeaderCard = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user, setUser } = useCurrentUser();
  const router = useRouter();

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const handleUserLogout = async () => {
    try {
      await apiClient.get(ApiRoutes.auth.logout());
      toast.success('User logged out');
      setUser(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to logout');
    }
  };

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
            <Avatar src={user?.image} alt={user?.name} radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user?.name || 'Create a free account'}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {user && <Menu.Label>Settings</Menu.Label>}
        <Menu.Item
          onClick={() => (user ? router.push('/account') : router.push('/login'))}
          leftSection={
            user ? (
              <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            ) : (
              <IconLogin style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            )
          }
        >
          {user ? 'Account settings' : 'Login'}
        </Menu.Item>
        <Menu.Item
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          leftSection={
            computedColorScheme === 'dark' ? (
              <IconSun style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            ) : (
              <IconMoon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            )
          }
        >
          {computedColorScheme === 'light' ? 'Dark mode' : 'Light mode'}
        </Menu.Item>
        <Menu.Item
          onClick={user ? handleUserLogout : () => router.push('/signup')}
          leftSection={
            user ? (
              <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            ) : (
              <IconClick style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            )
          }
        >
          {user ? 'Logout' : 'Signup'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
