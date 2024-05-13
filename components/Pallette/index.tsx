import reactLogo from '@/public/infra/react.png';
import apiGatewayImg from '@/public/infra/apg.png';
import nodeJsLogo from '@/public/infra/nodejs.png';
import mongoDbLogo from '@/public/infra/mongodb.png';
import fwLogo from '@/public/infra/fw.png';
import vm from '@/public/infra/vm.png';
import staticsite from '@/public/infra/staticsite.png';
import sqldb from '@/public/infra/sqldb.png';
import pythonserver from '@/public/infra/pythonserver.png';
import postgres from '@/public/infra/postgres.png';
import hub from '@/public/infra/hub.png';
import Image, { StaticImageData } from 'next/image';
import classes from '@/styles/pallette.module.css';
import { Tooltip } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { Node } from 'reactflow';
import { useDrag } from 'react-dnd';

interface PalletteProps {
  setNodes: Dispatch<SetStateAction<Array<Node>>>;
}

export const palletteItems: {
  [key: string]: StaticImageData;
} = {
  'React JS': reactLogo,
  'API Gateway': apiGatewayImg,
  'Node.js': nodeJsLogo,
  MongoDB: mongoDbLogo,
  Firewall: fwLogo,
  'Virtual Machine': vm,
  'Static Site': staticsite,
  'SQL Database': sqldb,
  'Python Server': pythonserver,
  Postgres: postgres,
  Hub: hub,
};

export const Pallette: React.FC<PalletteProps> = ({ setNodes }) => {
  const [, drag] = useDrag({
    type: 'imgNode',
    item: { type: 'imgNode' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, item: string) => {
    event.dataTransfer.setData('application/reactflow', 'imgNode');
    event.dataTransfer.setData('node-name', item);
  };

  const handlePalletteItemClick = (item: string) => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: Math.random().toString(),
        position: { x: 200, y: 200 },
        data: {
          img: <Image className={classes.nodeImg} src={palletteItems[item]} alt={item} />,
          label: item,
        },
        type: 'imgNode',
        className: classes.node,
      },
    ]);
  };

  return (
    <div className={classes.palletteContainer}>
      <div className={classes.infraPallette}>
        {Object.keys(palletteItems).map((item, index) => (
          <Tooltip label={item} key={index}>
            <div draggable="true" onDragStart={(event) => handleDragStart(event, item)} ref={drag}>
              <Image
                onClick={handlePalletteItemClick.bind(null, item)}
                className={classes.palletteItem}
                src={palletteItems[item]}
                alt={item}
              />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
