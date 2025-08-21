declare module 'jspdf' {
  export const jsPDF: any;
  export default jsPDF;
}

declare module 'jspdf-autotable' {
  const autoTable: any;
  export default autoTable;
}

declare module 'xlsx' {
  const XLSX: any;
  export = XLSX;
}

declare module 'pdf' {
  const pdf: any;
  export default pdf;
}

declare module 'lucide-react';

declare module "*.ttf?url" {
  const src: string;
  export default src;
}
