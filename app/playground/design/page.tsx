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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImgNode, ImgNodeProps } from '@/components/InfraNode';
import { Button, Tooltip, useMantineTheme } from '@mantine/core';
import { IconDeviceFloppy, IconStarFilled } from '@tabler/icons-react';
import { Pallette, palletteItems } from '@/components/Pallette';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  const theme = useMantineTheme();

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
        const res = await apiClient.get(ApiRoutes.design.get(query.get('project') as string));
        const data = res.data;
        setDesign(data.data.design);
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
    fetchDesign();
  }, []);

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
    try {
      await apiClient.put(ApiRoutes.design.update(design.designId), {
        components: {
          nodes: nodes.map((node) => ({
            id: node.id,
            type: node.type,
            resourceName: node.data.label.toLowerCase().split(' ').join('-'),
            position: node.position,
          })),
          edges: edges,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the design.');
    }
  };

  useEffect(() => {
    if (design.designId.length) {
      updateDesign();
    }
  }, [nodes, edges]);
  return (
    <>
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
          <Button
            component="button"
            className={classes.publishButton}
            leftSection={
              <IconDeviceFloppy style={{ width: '1rem', height: '1rem' }} color="#fff" />
            }
            variant="gradient"
          >
            Publish your design
          </Button>
          <Tooltip label="Use Magic tool to auto-generate a design" position="bottom">
            <Button
              component="button"
              className={classes.magicButton}
              leftSection={
                <IconStarFilled style={{ width: '1rem', height: '1rem' }} color="#fff" />
              }
              variant="default"
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
