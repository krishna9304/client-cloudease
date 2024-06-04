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
  ButtonProps,
} from '@mantine/core';
import classes from './CreateNewProject.module.css';
import { MouseEventHandler, useState } from 'react';

interface NewProjectFormValues {
  projectName: string;
  projectDescription: string;
  tags: string[];
}
const initialFormValues = {
  projectName: '',
  projectDescription: '',
  tags: [],
};
export function CreateNewProjectForm() {
  const [formValues, setFormValues] = useState<NewProjectFormValues>(initialFormValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formValues.projectName.length || !formValues.projectDescription.length) return;
    console.log(formValues);
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
              <Button onClick={handleSubmit} type="submit" className={classes.control}>
                Next
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
