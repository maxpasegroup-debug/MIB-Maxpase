"use client";

import dynamic from "next/dynamic";
import type { CareerReportPDFData } from "@/lib/careerReportPDF";

const PDFDownloadLink = dynamic(
  () =>
    import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const CareerReportPDFDocument = dynamic(
  () =>
    import("@/lib/careerReportPDF").then((mod) => mod.CareerReportPDFDocument),
  { ssr: false }
);

interface DownloadReportPDFButtonProps {
  data: CareerReportPDFData;
  className?: string;
}

export default function DownloadReportPDFButton({ data, className }: DownloadReportPDFButtonProps) {
  return (
    <PDFDownloadLink
      document={<CareerReportPDFDocument data={data} />}
      fileName="career-intelligence-report.pdf"
      className={className}
    >
      {({ loading }) => (
        <span className="inline-flex items-center justify-center rounded-xl bg-gray-800 px-6 py-3 text-white font-medium hover:bg-gray-900">
          {loading ? "Generating…" : "Download Intelligence Report"}
        </span>
      )}
    </PDFDownloadLink>
  );
}
