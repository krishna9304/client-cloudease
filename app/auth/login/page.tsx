'use client';
import { Paper, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import classes from '../login.module.css';
import Link from 'next/link';

export default function Login() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="sm" mb={50}>
          Welcome back to Cloudease!
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="sm" />
        <PasswordInput label="Password" placeholder="Your password" mt="sm" size="sm" />
        <Checkbox label="Keep me logged in" mt="xl" size="sm" />
        <Button fullWidth mt="xl" size="sm">
          Login
        </Button>

        <Text ta="center" mt="sm">
          Don&apos;t have an account? <Link href="/auth/signup">Register</Link>
        </Text>
      </Paper>
    </div>
  );
}
