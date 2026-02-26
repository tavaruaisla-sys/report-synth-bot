import { ReportData, REPORT_COLORS } from "@/lib/pdf/types";

interface Props {
  data: ReportData;
}

const CoverSlide = ({ data }: Props) => {
  return (
    <div 
      className="h-full flex flex-col items-center justify-center text-white"
      style={{ backgroundColor: REPORT_COLORS.primary }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: REPORT_COLORS.accent }}
      />
      <p className="text-sm font-medium tracking-widest mb-4 opacity-80">
        {data.brandName.toUpperCase()}
      </p>
      <h1 className="text-4xl font-bold mb-2">{data.reportTitle}</h1>
      <p className="text-sm opacity-70">
        Brand Monitoring & Reputation Report
      </p>
      <p className="text-xs mt-8 opacity-60">
        Update: {data.updateDate}
      </p>
    </div>
  );
};

export default CoverSlide;