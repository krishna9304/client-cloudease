'use client';
import { Paper, TextInput, PasswordInput, Button, Title, Text } from '@mantine/core';
import classes from '@/styles/auth.module.css';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="sm" mb={50}>
          Let's get started!
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="sm" />
        <PasswordInput label="Enter Password" placeholder="Enter Your password" mt="sm" size="sm" />
        <PasswordInput
          label="Re-Enter Password"
          placeholder="Re-Enter Your password"
          mt="sm"
          size="sm"
        />
        <Button variant="light" fullWidth mt="xl" size="sm">
          Sign up
        </Button>

        <Text ta="center" mt="sm">
          Already have an account? <Link href="/login">Login</Link>
        </Text>
      </Paper>
    </div>
  );
}
