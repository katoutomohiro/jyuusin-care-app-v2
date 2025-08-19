import React from 'react';
import ErrorBoundary from './ErrorBoundary';

type Props = { children: React.ReactNode; excelOnly?: boolean };

const RouteBoundary: React.FC<Props> = ({ children, excelOnly = true }) => {
  return <ErrorBoundary excelOnly={excelOnly}>{children}</ErrorBoundary>;
};

export default RouteBoundary;
