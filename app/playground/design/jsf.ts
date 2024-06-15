export interface SingleNodeFormType {
  nodeLabel?: string;
  inputs: Array<{
    name: string;
    type: string;
    label: string;
    placeholder: string;
  }>;
  radio?: Array<{
    name: string;
    label: string;
    options: Array<{ value: boolean; label: string }>;
  }>;
}

export interface NodeFormsType {
  [key: string]: SingleNodeFormType;
}
export const NodeForms: NodeFormsType = {
  'React JS': {
    inputs: [
      {
        name: 'appName',
        type: 'text',
        label: 'App Name',
        placeholder: 'Enter app name',
      },
      {
        name: 'port',
        type: 'number',
        label: 'Port',
        placeholder: 'Enter port to expose',
      },
      {
        name: 'sourceCode',
        type: 'text',
        label: 'Source Code',
        placeholder: 'Enter github repo url',
      },
    ],
    radio: [
      {
        name: 'publicIp',
        label: 'Do you want a public Ip?',
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
    ],
  },
  'Node.js': {
    inputs: [
      {
        name: 'appName',
        type: 'text',
        label: 'App Name',
        placeholder: 'Enter app name',
      },
      {
        name: 'port',
        type: 'number',
        label: 'Port',
        placeholder: 'Enter port to expose',
      },
      {
        name: 'sourceCode',
        type: 'text',
        label: 'Source Code',
        placeholder: 'Enter github repo url',
      },
    ],
    radio: [
      {
        name: 'publicIp',
        label: 'Do you want a public Ip?',
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
    ],
  },
  'Virtual Machine': {
    inputs: [
      {
        name: 'appName',
        type: 'text',
        label: 'App Name',
        placeholder: 'Enter app name',
      },
      {
        name: 'port',
        type: 'number',
        label: 'Port',
        placeholder: 'Enter port to expose',
      },
      {
        name: 'sourceCode',
        type: 'text',
        label: 'Source Code',
        placeholder: 'Enter github repo url',
      },
    ],
    radio: [
      {
        name: 'publicIp',
        label: 'Do you want a public Ip?',
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
    ],
  },
  'Python Server': {
    inputs: [
      {
        name: 'appName',
        type: 'text',
        label: 'App Name',
        placeholder: 'Enter app name',
      },
      {
        name: 'port',
        type: 'number',
        label: 'Port',
        placeholder: 'Enter port to expose',
      },
      {
        name: 'sourceCode',
        type: 'text',
        label: 'Source Code',
        placeholder: 'Enter github repo url',
      },
    ],
    radio: [
      {
        name: 'publicIp',
        label: 'Do you want a public Ip?',
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
    ],
  },
  MongoDB: {
    inputs: [
      {
        name: 'accountName',
        type: 'text',
        label: 'Account Name',
        placeholder: 'Enter account name',
      },
      {
        name: 'dbName',
        type: 'text',
        label: 'Database Name',
        placeholder: 'Enter database name',
      },
    ],
  },
};
