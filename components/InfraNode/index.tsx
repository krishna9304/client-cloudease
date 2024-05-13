import React from 'react';
import { Handle, Position } from 'reactflow';
import classes from '@/styles/infraNode.module.css';

export interface ImgNodeProps {
  data: {
    img: React.ReactNode;
    label: string;
  };
}

export const ImgNode: React.FC<ImgNodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <div className={classes.nodeStruct}>
        {data.img}
        <div className="title">{data.label}</div>
      </div>
      <Handle type="target" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Left} id="l" />
    </>
  );
};
