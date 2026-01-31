'use client';

import { useNode, Element } from '@craftjs/core';
import { ReactNode } from 'react';

interface CanvasProps {
  children?: ReactNode;
}

export const Canvas = ({ children }: CanvasProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="min-h-screen bg-white"
    >
      {children}
    </div>
  );
};

Canvas.craft = {
  displayName: 'Canvas',
  rules: {
    canDrag: () => false,
  },
};
