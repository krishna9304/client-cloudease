'use client';
import { Paper, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import classes from '@/styles/auth.module.css';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { useCurrentUser, useUserLoader } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { isEmail } from '@/utils/validate.util';

export interface LoginUserDetails {
  email: string;
  password: string;
}

const initialUserDetails: LoginUserDetails = {
  email: '',
  password: '',
};

export default function Login() {
  const { user, setUser } = useCurrentUser();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<LoginUserDetails>(initialUserDetails);
  const { setUserLoading } = useUserLoader();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const validateInputs = (): Array<string> => {
    const errors = [];
    if (!isEmail(userDetails.email)) errors.push('Please enter a valid email');
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateInputs();
    if (errors.length) {
      console.log(errors, userDetails);

      errors.forEach((error) => toast.error(error));
      return;
    }
    try {
      const response = await apiClient.post(ApiRoutes.auth.login(), userDetails);
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
          Welcome back to Cloudease!
        </Title>

        <TextInput
          onChange={handleChange}
          name="email"
          label="Email address"
          placeholder="hello@gmail.com"
          size="sm"
          required
        />
        <PasswordInput
          onChange={handleChange}
          name="password"
          label="Password"
          placeholder="Your password"
          mt="sm"
          size="sm"
          required
        />
        <Checkbox label="Keep me logged in" mt="xl" size="sm" />
        <Button onClick={handleSubmit} variant="light" fullWidth mt="xl" size="sm">
          Login
        </Button>

        <Text ta="center" mt="sm">
          Don&apos;t have an account? <Link href="/signup">Register</Link>
        </Text>
      </Paper>
    </div>
  );
}
