'use client';
import { NextPage } from 'next';
import classes from '@/styles/design.module.css';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { ImgNode, ImgNodeProps } from '@/components/InfraNode';
import { Button, Modal, Radio, TextInput, Tooltip, useMantineTheme } from '@mantine/core';
import { IconDeviceFloppy, IconStarFilled } from '@tabler/icons-react';
import { Pallette, palletteItems } from '@/components/Pallette';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { NewProjectFormValues, initialProjectFormValues } from '@/components/CreateNewProject';
import { theme } from '@/theme';
import { NodeForms, NodeFormsType, SingleNodeFormType } from './jsf';

interface DesignPageProps {}
interface BoardProps {}

export interface CanvasNode {
  id: string;
  type: string;
  resourceName: string;
  position: {
    x: number;
    y: number;
  };
}
export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}
export interface CanvasComponents {
  nodes: Array<CanvasNode>;
  edges: Array<CanvasEdge>;
}

export interface Design {
  designId: string;
  projectId: string;
  components: CanvasComponents;
  created_at?: string;
  updated_at?: string;
  metadata?: any;
}

const Board: React.FC<BoardProps> = () => {
  const [design, setDesign] = useState<Design>({
    designId: '',
    projectId: '',
    components: {
      nodes: [],
      edges: [],
    },
  });
  const [project, setProject] = useState<NewProjectFormValues>(initialProjectFormValues);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<
    SingleNodeFormType & {
      nodeData: Node;
    }
  >({
    nodeLabel: '',
    inputs: [],
    radio: [],
    nodeData: {
      id: '',
      type: '',
      position: { x: 0, y: 0 },
      data: {
        img: <div></div>,
        label: '',
      },
      className: '',
    },
  });
  interface formDataIndexSignature {
    [key: string]: string;
  }
  const [allFormDatas, setAllFormDatas] = useState<{
    [key: string]: formDataIndexSignature;
  }>();
  const [modalOpen, setModalOpen] = useState(false);
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowInstance) {
        const type = event.dataTransfer.getData('application/reactflow');
        const nodeName = event.dataTransfer.getData('node-name');

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node & { data: ImgNodeProps['data'] } = {
          id: Math.random().toString(),
          type: type,
          position,
          data: {
            img: <Image className={classes.nodeImg} src={palletteItems[nodeName]} alt={nodeName} />,
            label: nodeName,
          },
          className: classes.node,
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes, reactFlowInstance]
  );

  const nodeTypes = useMemo(() => ({ imgNode: ImgNode }), []);

  const query = useSearchParams();
  const router = useRouter();

  const fetchDesign = async () => {
    if (!query.has('project')) {
      toast.error('No project id found. Redirecting to home page...');
      router.push('/');
    } else {
      try {
        const res1 = await apiClient.get(ApiRoutes.design.get(query.get('project') as string));
        const data = res1.data;
        setDesign(data.data.design);

        setAllFormDatas(() => {
          return data.data.design.components.nodes.reduce(
            (acc: any, node: any) => {
              const imgKey = getImageKey(node.resourceName) as keyof typeof palletteItems;
              acc[node.id] = {
                id: node.id,
                ...NodeForms[imgKey].inputs.reduce((acc, input) => {
                  acc[input.name] = node.config ? node.config[input.name] : '';
                  return acc;
                }, {} as formDataIndexSignature),
                ...NodeForms[imgKey].radio?.reduce((acc, radio) => {
                  acc[radio.name] = node.config ? node.config[radio.name] : 'false';
                  return acc;
                }, {} as formDataIndexSignature),
              };
              return acc;
            },
            {} as { [key: string]: formDataIndexSignature }
          );
        });

        const res2 = await apiClient.get(ApiRoutes.project.get(query.get('project') as string));
        const projectData = res2.data;
        setProject(projectData.data.project);
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching the design. Redirecting to home page...');
        router.push('/');
      }
    }
  };

  const getImageKey = (resourceName: string) => {
    const imgKey = Object.keys(palletteItems).find(
      (key) => key.toLowerCase().split(' ').join('-') === resourceName
    );
    return imgKey;
  };

  useEffect(() => {
    if (!project.projectId?.length) {
      fetchDesign();
    } else if (project.publishing) {
      toast.loading('Your design is being published. Check logs for more info.');
    }
    return () => {
      toast.dismiss();
    };
  }, [project]);

  useEffect(() => {
    setNodes(() => [
      ...design.components.nodes.map((node) => {
        const imgKey = getImageKey(node.resourceName) as keyof typeof palletteItems;
        return {
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            img: (
              <Image
                className={classes.nodeImg}
                src={palletteItems[imgKey]}
                alt={node.resourceName}
              />
            ),
            label: imgKey,
          },
          className: classes.node,
        };
      }),
    ]);
    setEdges(design.components.edges);
  }, [design]);

  const updateDesign = async () => {
    checkPublishEligibility('update');
    try {
      await apiClient.put(ApiRoutes.design.update(design.designId), {
        components: {
          nodes: nodes.map((node) => ({
            id: node.id,
            type: node.type,
            resourceName: node.data.label.toLowerCase().split(' ').join('-'),
            position: node.position,
            config: allFormDatas?.[node.id],
          })),
          edges: edges,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (design.designId.length && !project.publishing && !project.published) {
      updateDesign();
    }
  }, [nodes, edges]);

  const checkPublishEligibility = (checkType: string = 'publish'): string[] => {
    let errors: string[] = [];
    const nodeLabels = nodes.map((node) => node.data.label);
    const unSupportedNodes = nodeLabels.filter((label) => !NodeForms.hasOwnProperty(label));

    if (unSupportedNodes.length) {
      if (checkType === 'update') {
        setNodes((prev) => prev.filter((node) => !unSupportedNodes.includes(node.data.label)));
        toast.error('You tried to add an unsupported node: ' + unSupportedNodes.join(', '));
      } else {
        errors.push('Some nodes are not supported. Please remove them before publishing.');
        errors.push('Unsupported nodes: ' + unSupportedNodes.join(', '));
      }
      return errors;
    }

    if (!nodes.length) {
      errors.push('No nodes found. Add some nodes to publish the design.');
      return errors;
    }
    if (!nodes.every((node) => allFormDatas?.hasOwnProperty(node.id))) {
      errors.push('Please configure all nodes before publishing the design.');
      return errors;
    }
    for (const node of nodes) {
      const formData = allFormDatas?.[node.id];
      for (const input of NodeForms[node.data.label as keyof typeof palletteItems].inputs) {
        if (!formData?.[input.name] || !formData?.[input.name].trim().length) {
          errors.push('Please fill all the required fields before publishing the design.');
          return errors;
        }
        if (input.type === 'number' && isNaN(Number(formData[input.name]))) {
          errors.push('Please enter a valid number in the number fields.');
          return errors;
        }
        const obseleteChars = [
          '!',
          '@',
          '#',
          '$',
          '%',
          '^',
          '&',
          '*',
          '(',
          ')',
          '+',
          '=',
          '{',
          '}',
          '[',
          ']',
          '|',
          '\\',
          ':',
          ';',
          '"',
          "'",
          '<',
          '>',
          ',',
          '.',
          '/',
          '?',
          '`',
          '~',
          ' ',
        ];
        if (
          input.type === 'text' &&
          input.name !== 'sourceCode' &&
          obseleteChars.some((char) => formData[input.name].includes(char))
        ) {
          errors.push('Please remove special characters from the text fields.');
          return errors;
        }
      }
    }
    return errors;
  };

  const publishDesign = async () => {
    const errs = checkPublishEligibility();

    if (errs.length) {
      errs.forEach((err) => toast.error(err));
      return;
    }
    try {
      const res = await apiClient.post(ApiRoutes.design.publish(design.projectId), allFormDatas);
      const data = res.data;
      toast.success(data.message);
      router.push('/playground/console?project=' + design.projectId);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while publishing the design.');
    }
  };

  const onNodeClick = (_e: React.MouseEvent, node: Node) => {
    if (NodeForms.hasOwnProperty(node.data.label)) {
      const nodeForm = NodeForms[node.data.label as keyof typeof palletteItems];
      setSelectedNode({
        ...nodeForm,
        nodeLabel: node.data.label,
        nodeData: node,
      });

      if (!allFormDatas?.hasOwnProperty(node.id)) {
        setAllFormDatas((prev) => ({
          ...prev,
          [node.data.id]: {
            ...nodeForm.inputs.reduce((acc, input) => {
              acc[input.name] = '';
              return acc;
            }, {} as formDataIndexSignature),
            ...nodeForm.radio?.reduce((acc, radio) => {
              acc[radio.name] = 'false';
              return acc;
            }, {} as formDataIndexSignature),
          },
        }));
      }
    }
    setModalOpen(true);
  };

  const handleNodeFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAllFormDatas((prev) => ({
      ...prev,
      [selectedNode?.nodeData.id]: {
        ...prev?.[selectedNode?.nodeData.id],
        [name]: value,
      },
    }));
  };

  return (
    <>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedNode ? (
          <div className={classes.nodeFormContainer}>
            <h2>Configure {selectedNode.nodeLabel}</h2>
            {selectedNode.inputs.map((input, index) => (
              <TextInput
                key={index}
                onChange={handleNodeFormChange}
                value={allFormDatas?.[selectedNode.nodeData.id]?.[input.name] as string}
                name={input.name}
                required
                label={input.label}
                placeholder={input.placeholder}
                type={input.type}
              />
            ))}
            {selectedNode.radio
              ? selectedNode.radio?.map((radio, index) => (
                  <div className={classes.radioOptions} key={index}>
                    <label>{radio.label}</label>
                    {radio.options.map((option, i) => (
                      <Radio
                        key={i}
                        onChange={handleNodeFormChange}
                        name={radio.name}
                        value={String(option.value)}
                        checked={
                          allFormDatas?.[selectedNode.nodeData.id]?.[radio.name] ===
                          String(option.value)
                        }
                        label={option.label}
                      />
                    ))}
                  </div>
                ))
              : null}
          </div>
        ) : (
          <div>This component is currently not supported.</div>
        )}
      </Modal>
      <div className={classes.designContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
          onNodeDoubleClick={onNodeClick}
        >
          <Controls />
          <MiniMap
            style={{
              background: 'gray',
            }}
            autoSave={'true'}
            autoFocus={true}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Tooltip
            label={
              project.publishing
                ? 'Your design is being published. Check logs for more info.'
                : project.published
                  ? 'You design is already published. Click to check logs!'
                  : 'Click to publish your design'
            }
            position="bottom"
          >
            <Button
              component="button"
              className={classes.publishButton}
              leftSection={
                <IconDeviceFloppy style={{ width: '1rem', height: '1rem' }} color="#fff" />
              }
              onClick={
                project.published || project.publishing
                  ? () => router.push('/playground/console?project=' + project.projectId)
                  : publishDesign
              }
              variant={project.published || project.publishing ? 'default' : 'gradient'}
            >
              {project.published || project.publishing ? 'Check logs' : 'Publish'}
            </Button>
          </Tooltip>
          <Tooltip label="Use Magic tool to auto-generate a design" position="bottom">
            <Button
              component="button"
              className={classes.magicButton}
              leftSection={
                <IconStarFilled style={{ width: '1rem', height: '1rem' }} color="#fff" />
              }
              style={{ right: project.published || project.publishing ? '155px' : '130px' }}
              variant="filled"
            >
              Magic tool
            </Button>
          </Tooltip>
          <Pallette setNodes={setNodes} />
        </ReactFlow>
      </div>
    </>
  );
};

const DesignPage: NextPage<DesignPageProps> = () => {
  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <Board />
      </DndProvider>
    </ReactFlowProvider>
  );
};

export default DesignPage;
