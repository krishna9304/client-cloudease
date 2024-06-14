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
  Text,
  Box,
} from '@mantine/core';
import classes from './CreateNewProject.module.css';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientSegmentedControl } from '../GradientSegmentedControl';

import awsLogo from '@/public/infra/aws_logo.png';
import azureLogo from '@/public/infra/azure_logo.webp';

export interface NewProjectFormValues {
  projectId?: string;
  projectName: string;
  projectDescription: string;
  tags: string[];
  cloudProvider: string;
  awsDetails?: AwsDetails;
  azureDetails?: AzureDetails;
}
export const initialProjectFormValues = {
  projectId: undefined,
  projectName: '',
  projectDescription: '',
  tags: [],
  cloudProvider: 'aws',
};

interface AzureDetails {
  clientId: string;
  clientSecret: string;
  subscriptionId: string;
  tenantId: string;
  accessKey: string;
  region: string;
  backendResourceGroup: string;
  backendStorageAccount: string;
  backendContainer: string;
  backendKey: string;
}

const initialAzureDetails = {
  clientId: '',
  clientSecret: '',
  subscriptionId: '',
  tenantId: '',
  accessKey: '',
  region: '',
  backendResourceGroup: '',
  backendStorageAccount: '',
  backendContainer: '',
  backendKey: '',
};
interface AwsDetails {
  accessKey: string;
  secretKey: string;
  region: string;
}

const initialAwsDetails = {
  accessKey: '',
  secretKey: '',
  region: '',
};

export function CreateNewProjectForm() {
  const [formValues, setFormValues] = useState<NewProjectFormValues>(initialProjectFormValues);
  const [azureDetails, setAzureDetails] = useState<AzureDetails>(initialAzureDetails);
  const [awsDetails, setAwsDetails] = useState<AwsDetails>(initialAwsDetails);

  const router = useRouter();
  const queryParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'region' || e.target.name === 'accessKey') {
      if (formValues.cloudProvider === 'aws')
        setAwsDetails((values) => ({ ...values, [e.target.name]: e.target.value }));
      else setAzureDetails((values) => ({ ...values, [e.target.name]: e.target.value }));
      return;
    }
    if (awsDetails.hasOwnProperty(e.target.name))
      setAwsDetails((values) => ({ ...values, [e.target.name]: e.target.value }));
    else if (azureDetails.hasOwnProperty(e.target.name))
      setAzureDetails((values) => ({ ...values, [e.target.name]: e.target.value }));
    else setFormValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formValues.projectName.length || !formValues.projectDescription.length) return;

    if (formValues.cloudProvider === 'aws') {
      if (!awsDetails.accessKey.length || !awsDetails.secretKey.length || !awsDetails.region.length)
        return;
    } else {
      if (
        !azureDetails.clientId.length ||
        !azureDetails.clientSecret.length ||
        !azureDetails.subscriptionId.length ||
        !azureDetails.tenantId.length ||
        !azureDetails.accessKey.length ||
        !azureDetails.region.length ||
        !azureDetails.backendResourceGroup.length ||
        !azureDetails.backendStorageAccount.length ||
        !azureDetails.backendContainer.length ||
        !azureDetails.backendKey.length
      )
        return;
    }

    let reqBody = formValues;
    if (formValues.cloudProvider === 'aws') reqBody = { ...reqBody, awsDetails };
    else reqBody = { ...reqBody, azureDetails };

    try {
      await apiClient.post(ApiRoutes.project.create(), reqBody);
      setFormValues(initialProjectFormValues);
      setAwsDetails(initialAwsDetails);
      setAzureDetails(initialAzureDetails);
      toast.success('Project created.');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    }
  };

  const fetchDesign = async () => {
    if (!queryParams.has('project')) {
      setFormValues(initialProjectFormValues);
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
          cloudProvider: projectData.cloudProvider,
        });
        if (projectData.cloudProvider === 'aws') setAwsDetails(projectData.awsDetails);
        else setAzureDetails(projectData.azureDetails);
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching project details.');
        setFormValues(initialProjectFormValues);
      }
    }
  };

  useEffect(() => {
    fetchDesign();
  }, []);

  const handleUpdate = async () => {
    if (!formValues.projectName.length || !formValues.projectDescription.length) return;
    if (formValues.cloudProvider === 'aws') {
      if (!awsDetails.accessKey.length || !awsDetails.secretKey.length || !awsDetails.region.length)
        return;
    } else {
      if (
        !azureDetails.clientId.length ||
        !azureDetails.clientSecret.length ||
        !azureDetails.subscriptionId.length ||
        !azureDetails.tenantId.length ||
        !azureDetails.accessKey.length ||
        !azureDetails.region.length ||
        !azureDetails.backendResourceGroup.length ||
        !azureDetails.backendStorageAccount.length ||
        !azureDetails.backendContainer.length ||
        !azureDetails.backendKey.length
      )
        return;
    }
    if (formValues.projectId) {
      try {
        const pId = formValues.projectId;
        delete formValues.projectId;

        let reqBody = formValues;
        if (formValues.cloudProvider === 'aws') reqBody = { ...reqBody, awsDetails };
        else reqBody = { ...reqBody, azureDetails };

        const res = await apiClient.put(ApiRoutes.project.update(pId), reqBody);
        const projectData = res.data.data.project;
        setFormValues({
          projectId: projectData.projectId,
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
          tags: projectData.tags,
          cloudProvider: projectData.cloudProvider,
        });
        toast.success('Project updated.');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update project');
      }
    }
  };

  const cloudProviders = [
    { value: 'aws', image: awsLogo, label: 'Amazon Web Services' },
    { value: 'azure', image: azureLogo, label: 'Microsoft Azure' },
  ];

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
            <Box mt="md">
              <Text>Choose cloud provider:</Text>
              <GradientSegmentedControl
                onChange={(value) =>
                  setFormValues((values) => ({ ...values, cloudProvider: value }))
                }
                options={cloudProviders}
                value={formValues.cloudProvider}
              />
              {formValues.cloudProvider === 'aws' ? (
                <SimpleGrid mt="md" cols={{ base: 1, sm: 2, md: 2 }}>
                  <TextInput
                    onChange={handleChange}
                    name="accessKey"
                    required
                    label="Access key"
                    placeholder="Your access key"
                    value={awsDetails.accessKey}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="secretKey"
                    required
                    label="Secret key"
                    placeholder="Your secret key"
                    value={awsDetails.secretKey}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="region"
                    required
                    label="Region"
                    placeholder="Your region"
                    value={awsDetails.region}
                  />
                </SimpleGrid>
              ) : (
                <SimpleGrid mt="md" cols={{ base: 1, sm: 2, md: 2 }}>
                  <TextInput
                    onChange={handleChange}
                    name="clientId"
                    required
                    label="Client ID"
                    placeholder="Your client ID"
                    value={azureDetails.clientId}
                  />
                  <TextInput
                    flex={1}
                    onChange={handleChange}
                    name="clientSecret"
                    required
                    label="Client secret"
                    placeholder="Your client secret"
                    value={azureDetails.clientSecret}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="subscriptionId"
                    required
                    label="Subscription ID"
                    placeholder="Your subscription ID"
                    value={azureDetails.subscriptionId}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="tenantId"
                    required
                    label="Tenant ID"
                    placeholder="Your tenant ID"
                    value={azureDetails.tenantId}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="accessKey"
                    required
                    label="Access key"
                    placeholder="Your Access key"
                    value={azureDetails.accessKey}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="region"
                    required
                    label="Region"
                    placeholder="Your region"
                    value={azureDetails.region}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="backendResourceGroup"
                    required
                    label="Backend Resource group"
                    placeholder="Your backend resource group"
                    value={azureDetails.backendResourceGroup}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="backendStorageAccount"
                    required
                    label="Backend Storage account"
                    placeholder="Your backend storage account"
                    value={azureDetails.backendStorageAccount}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="backendContainer"
                    required
                    label="Backend Container"
                    placeholder="Your backend container"
                    value={azureDetails.backendContainer}
                  />
                  <TextInput
                    onChange={handleChange}
                    name="backendKey"
                    required
                    label="Backend Key"
                    placeholder="Your backend key"
                    value={azureDetails.backendKey}
                  />
                </SimpleGrid>
              )}
            </Box>
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
