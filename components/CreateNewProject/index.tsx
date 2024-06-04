'use client';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  SimpleGrid,
  Title,
  TagsInput,
} from '@mantine/core';
import classes from './CreateNewProject.module.css';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

interface NewProjectFormValues {
  projectId?: string;
  projectName: string;
  projectDescription: string;
  tags: string[];
}
const initialFormValues = {
  projectId: undefined,
  projectName: '',
  projectDescription: '',
  tags: [],
};
export function CreateNewProjectForm() {
  const [formValues, setFormValues] = useState<NewProjectFormValues>(initialFormValues);
  const router = useRouter();
  const queryParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formValues.projectName.length || !formValues.projectDescription.length) return;
    try {
      await apiClient.post(ApiRoutes.project.create(), formValues);
      setFormValues(initialFormValues);
      toast.success('Project created.');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    }
  };

  const fetchDesign = async () => {
    if (!queryParams.has('project')) {
      setFormValues(initialFormValues);
    } else {
      try {
        const res = await apiClient.get(
          ApiRoutes.project.get(queryParams.get('project') as string)
        );
        const projectData = res.data.data.project;
        setFormValues({
          projectId: projectData.projectId,
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
          tags: projectData.tags,
        });
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching project details.');
        setFormValues(initialFormValues);
      }
    }
  };

  useEffect(() => {
    fetchDesign();
  }, []);

  const handleUpdate = async () => {
    if (!formValues.projectName.length || !formValues.projectDescription.length) return;
    if (formValues.projectId) {
      try {
        const pId = formValues.projectId;
        delete formValues.projectId;
        const res = await apiClient.put(ApiRoutes.project.update(pId), formValues);
        const projectData = res.data.data.project;
        setFormValues({
          projectId: projectData.projectId,
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
          tags: projectData.tags,
        });
        toast.success('Project updated.');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update project');
      }
    }
  };

  return (
    <Paper shadow="md" radius="lg">
      <div className={classes.wrapper}>
        <div
          className={classes.contacts}
          style={{
            background: `linear-gradient(0deg, rgba(52,0,0,1) 0%, rgba(91,0,85,1) 0%, rgba(255,0,140,1) 100%)`,
          }}
        >
          <Title order={1} style={{ color: 'white' }}>
            You're just a few steps from being Bob-The-Builder of cloud!
          </Title>
        </div>

        <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
          <div className={classes.fields}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                onChange={handleChange}
                value={formValues.projectName}
                name="projectName"
                required
                label="Project name"
                placeholder="Your project name"
              />
            </SimpleGrid>

            <Textarea
              name="projectDescription"
              value={formValues.projectDescription}
              onChange={handleChange}
              mt="md"
              required
              label="Project description"
              placeholder="Please include all relevant information"
              minRows={3}
            />

            <TagsInput
              name="tags"
              value={formValues.tags}
              onChange={(value) => setFormValues((values) => ({ ...values, tags: value }))}
              mt="md"
              label="Tags (Optional)"
              placeholder="Comma separated values"
            />

            <Group justify="flex-end" mt="md">
              <Button
                onClick={formValues.projectId ? handleUpdate : handleSubmit}
                type="submit"
                className={classes.control}
              >
                {formValues.projectId ? 'Update project' : 'Create project'}
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
