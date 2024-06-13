import { SegmentedControl } from '@mantine/core';
import classes from './GradientSegmentedControl.module.css';
import { StaticImageData } from 'next/image';
import React from 'react';

interface Data {
  label: string;
  value: string;
  image: StaticImageData;
}

interface GradientSegmentedControlProps {
  options: Data[];
  onChange: (value: string) => void;
  value: string;
}

export const GradientSegmentedControl: React.FC<GradientSegmentedControlProps> = ({
  options,
  onChange,
  value,
}) => {
  return (
    <SegmentedControl
      radius="xl"
      size="md"
      onChange={onChange}
      data={options.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
      classNames={classes}
      value={value}
    />
  );
};
