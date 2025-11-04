import React, { ReactNode } from 'react';
import './PanelContainer.css';

interface PanelContainerProps {
  children: ReactNode;
  className?: string;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({ children, className = '' }) => {
  return <div className={`panel-container ${className}`}>{children}</div>;
};
