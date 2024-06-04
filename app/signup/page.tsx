'use client';
import { Paper, TextInput, PasswordInput, Button, Title, Text } from '@mantine/core';
import classes from '@/styles/auth.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { useCurrentUser, useUserLoader } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { isEmail } from '@/utils/validate.util';

export interface SignupUserDetails {
  email: string;
  name: string;
  password: string;
  rePassword?: string;
}

const initialUserDetails: SignupUserDetails = {
  email: '',
  name: '',
  password: '',
  rePassword: '',
};

export default function Signup() {
  const { user, setUser } = useCurrentUser();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<SignupUserDetails>(initialUserDetails);
  const { setUserLoading } = useUserLoader();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const validateInputs = (): Array<string> => {
    const errors = [];
    if (!isEmail(userDetails.email)) errors.push('Please enter a valid email');
    if (userDetails.password.length < 8) errors.push('Password must be at least 8 characters');
    if (!userDetails.name.trim().length) errors.push('Please enter your name');
    if (userDetails.password !== userDetails.rePassword) errors.push('Passwords do not match');
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateInputs();
    if (errors.length) {
      errors.forEach((error) => toast.error(error));
      return;
    }
    try {
      delete userDetails.rePassword;
      const response = await apiClient.post(ApiRoutes.user.signup(), userDetails);
      toast.success(response.data.message);
      setUser(response.data.data.user);
      setUserDetails(initialUserDetails);
    } catch (error: any) {
      toast.error(error.response.data.message || 'An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/');
      setUserLoading(false);
    }
  }, [user]);

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="sm" mb={50}>
          Let's get started!
        </Title>

        <TextInput
          onChange={handleChange}
          required
          name="email"
          label="Email address"
          placeholder="hello@gmail.com"
          size="sm"
        />
        <TextInput
          onChange={handleChange}
          required
          name="name"
          label="Name"
          placeholder="John Doe"
          size="sm"
        />
        <PasswordInput
          onChange={handleChange}
          name="password"
          required
          label="Enter Password"
          placeholder="Enter Your password"
          mt="sm"
          size="sm"
        />
        <PasswordInput
          onChange={handleChange}
          name="rePassword"
          required
          label="Re-Enter Password"
          placeholder="Re-Enter Your password"
          mt="sm"
          size="sm"
        />
        <Button onClick={handleSubmit} variant="light" fullWidth mt="xl" size="sm">
          Sign up
        </Button>

        <Text ta="center" mt="sm">
          Already have an account? <Link href="/login">Login</Link>
        </Text>
      </Paper>
    </div>
  );
}
