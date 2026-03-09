'use client';

import { pdfjs } from 'react-pdf';

// Use the worker bundled by webpack as a URL asset to avoid import.meta issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
