import React from 'react';
import { Document } from '@react-pdf/renderer';
import { DailyLogA4Sheet } from './pdf/DailyLogA4Sheet';
import { DailyLogDto } from '../types';

interface DailyLogPdfDocProps {
  dto: DailyLogDto;
}

const DailyLogPdfDoc: React.FC<DailyLogPdfDocProps> = ({ dto }) => (
  <Document>
    <DailyLogA4Sheet dto={dto} />
  </Document>
);

export default DailyLogPdfDoc;

