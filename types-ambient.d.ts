declare module 'lucide-react' {
  import * as React from 'react';
  export const Home: React.ComponentType<any>;
  export const Users: React.ComponentType<any>;
  export const FileText: React.ComponentType<any>;
  export const Plus: React.ComponentType<any>;
  export const BarChart3: React.ComponentType<any>;
}

declare module 'jspdf' {
  export class jsPDF {
    constructor(...args: any[]);
    save(name?: string): void;
    // minimal other members
  }
}

declare module 'jspdf-autotable' {
  const autoTable: any;
  export default autoTable;
}

declare module 'xlsx' {
  const XLSX: any;
  export default XLSX;
}

// allow font url imports used by Vite
declare module '*?url' {
  const url: string;
  export default url;
}
