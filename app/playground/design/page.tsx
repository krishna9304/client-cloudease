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
import { useCallback, useEffect, useMemo } from 'react';
import { ImgNode, ImgNodeProps } from '@/components/InfraNode';
import { Button } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Pallette, palletteItems } from '@/components/Pallette';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';

interface DesignPageProps {}
interface BoardProps {}

const Board: React.FC<BoardProps> = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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

  useEffect(() => {
    console.log('Nodes', nodes);
    console.log('Edges', edges);
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
            className={classes.saveDesignButton}
            leftSection={
              <IconDeviceFloppy style={{ width: '1rem', height: '1rem' }} color="#00ACEE" />
            }
            variant="default"
          >
            Save your design
          </Button>
          <Button
            component="button"
            className={classes.publishButton}
            leftSection={
              <IconDeviceFloppy style={{ width: '1rem', height: '1rem' }} color="#00ACEE" />
            }
            variant="gradient"
          >
            Publish
          </Button>
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
