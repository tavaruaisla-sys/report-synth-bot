import { ReportData, REPORT_COLORS } from "@/lib/pdf/types";

interface Props {
  data: ReportData;
}

const CoverSlide = ({ data }: Props) => {
  return (
    <div 
      className="h-full flex flex-col items-center justify-center text-white"
      style={{ backgroundColor: '#0f172a' }} // Dark navy background
    >
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h1 className="text-5xl font-bold tracking-tight text-cyan-400">
          {data.reportTitle}
        </h1>
        
        <div className="text-xl text-white mt-4">
          Update {data.updateDate}
        </div>
      </div>
    </div>
  );
};

export default CoverSlide;
