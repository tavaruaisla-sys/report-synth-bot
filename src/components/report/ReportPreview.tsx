import { ReportData, REPORT_COLORS } from "@/lib/pdf/types";
import { TrendingUp, TrendingDown, AlertCircle, FileText, Sparkles } from "lucide-react";

interface ReportPreviewProps {
  data: ReportData;
}

const ReportPreview = ({ data }: ReportPreviewProps) => {
  return (
    <div className="space-y-4">
      {/* Slide 1: Cover */}
      <SlideWrapper>
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
      </SlideWrapper>

      {/* Slide 2: REPUTATION RECOVERY - CURRENT STATUS */}
      <SlideWrapper>
        <SlideHeader title="REPUTATION RECOVERY - CURRENT STATUS" pageNum={2} />
        <div className="p-8 flex flex-col gap-6 h-full overflow-hidden text-black">
          {/* News Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: REPORT_COLORS.primary }}>
              NEWS / PEMBERITAAN
            </h3>
            <ul className="space-y-1.5 list-none">
              {data.newsBulletPoints && data.newsBulletPoints.length > 0 ? (
                data.newsBulletPoints.map((point, i) => (
                  <li key={i} className="text-[10px] leading-relaxed flex items-start gap-2 text-black">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black" />
                    <span>{point}</span>
                  </li>
                ))
              ) : (
                <li className="text-[10px] text-muted-foreground italic">Belum ada data berita.</li>
              )}
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: REPORT_COLORS.primary }}>
              SOSIAL MEDIA - TIKTOK
            </h3>
            
            {/* Aktivitas Akun Lawan */}
            <div className="space-y-1">
              <h4 className="font-bold text-[11px] text-black">Aktivitas Akun Lawan</h4>
              <ul className="space-y-1 list-none ml-1">
                <li className="text-[10px] flex items-center gap-2 text-black">
                  <span className="h-1 w-1 rounded-full bg-black" />
                  <span><span className="font-bold">Sebelum:</span> {data.socialMediaAccountStatusBefore || '-'}</span>
                </li>
                <li className="text-[10px] flex items-center gap-2 text-black">
                  <span className="h-1 w-1 rounded-full bg-black" />
                  <span><span className="font-bold">Sesudah:</span> {data.socialMediaAccountStatusAfter || '-'}</span>
                </li>
              </ul>
              {data.socialMediaAccountStatusNote && (
                <p className="text-[10px] italic ml-4 text-black">
                  {data.socialMediaAccountStatusNote}
                </p>
              )}
            </div>

            {/* Aktivitas Counter Kita */}
            <div className="space-y-1">
              <h4 className="font-bold text-[11px] text-black">Aktivitas Counter Kita</h4>
              <ul className="space-y-1 list-none ml-1">
                <li className="text-[10px] flex items-center gap-2 text-black">
                  <span className="h-1 w-1 rounded-full bg-black" />
                  <span><span className="font-bold">Total views konten counter:</span> {data.socialMediaCounterTotalViews || '-'}</span>
                </li>
                <li className="text-[10px] flex items-center gap-2 text-black">
                  <span className="h-1 w-1 rounded-full bg-black" />
                  <span><span className="font-bold">Total engagement:</span> {data.socialMediaCounterTotalEngagement || '-'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SlideWrapper>

      {/* Slide 3: Results Divider */}
      <SlideWrapper>
        <div 
          className="h-full flex flex-col items-center justify-center text-white"
          style={{ backgroundColor: REPORT_COLORS.primary }}
        >
          <div 
            className="w-16 h-1 mb-4"
            style={{ backgroundColor: REPORT_COLORS.accent }}
          />
          <h2 className="text-3xl font-bold">RESULTS</h2>
          <p className="text-sm opacity-70 mt-2">Detailed search analysis and findings</p>
        </div>
      </SlideWrapper>

      {/* Slide 4: Before Screenshot */}
      <SlideWrapper>
        <SlideHeader title="GOOGLE SEARCH - BEFORE" pageNum={4} />
        <div className="p-4 flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden border-2 border-dashed border-border p-2 min-h-0">
            {data.serpScreenshotBefore && data.serpScreenshotBefore.length > 0 ? (
              <div className={`grid gap-2 w-full h-full ${
                data.serpScreenshotBefore.length === 1 ? 'grid-cols-1' :
                data.serpScreenshotBefore.length === 2 ? 'grid-cols-2' :
                data.serpScreenshotBefore.length <= 4 ? 'grid-cols-2 grid-rows-2' :
                'grid-cols-3 grid-rows-2'
              }`}>
                {data.serpScreenshotBefore.slice(0, 6).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 flex items-center justify-center bg-white rounded-sm overflow-hidden">
                     <img 
                       src={src} 
                       alt={`Before screenshot ${i+1}`} 
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No screenshot uploaded</p>
              </div>
            )}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2 italic shrink-0">
            {data.serpCaptions?.before || 'Before optimization'}
          </p>
        </div>
      </SlideWrapper>

      {/* Slide 5: After Screenshot (New Layout) */}
      <SlideWrapper>
        <div className="flex flex-col h-full bg-white p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-[#0f172a] uppercase mb-6 text-left">
            AFTER - {data.updateDate}
          </h2>
          
          {/* Content */}
          <div className="flex-1 min-h-0">
            {data.serpScreenshotAfter && data.serpScreenshotAfter.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 h-full">
                {data.serpScreenshotAfter.slice(0, 3).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                     <img 
                       src={src} 
                       alt={`After screenshot ${i+1}`} 
                       className="w-full h-full object-cover object-top"
                     />
                   </div>
                ))}
                {/* Fill empty slots if less than 3 images to maintain grid structure */}
                {[...Array(Math.max(0, 3 - data.serpScreenshotAfter.length))].map((_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50 border border-dashed border-gray-200 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm text-gray-400">No screenshot uploaded</p>
              </div>
            )}
          </div>
        </div>
      </SlideWrapper>

      {/* Slide 6: AI Result - Before */}
      <SlideWrapper>
        <SlideHeader title="AI RESULT - BEFORE" pageNum={6} />
        <div className="p-4 flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden border-2 border-dashed border-border p-2 min-h-0">
            {data.serpScreenshotBefore2 && data.serpScreenshotBefore2.length > 0 ? (
              <div className={`grid gap-2 w-full h-full ${
                data.serpScreenshotBefore2.length === 1 ? 'grid-cols-1' :
                data.serpScreenshotBefore2.length === 2 ? 'grid-cols-2' :
                data.serpScreenshotBefore2.length <= 4 ? 'grid-cols-2 grid-rows-2' :
                'grid-cols-3 grid-rows-2'
              }`}>
                {data.serpScreenshotBefore2.slice(0, 6).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 flex items-center justify-center bg-white rounded-sm overflow-hidden">
                     <img 
                       src={src} 
                       alt={`AI Result Before ${i+1}`} 
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No screenshot uploaded (AI Result Before)</p>
              </div>
            )}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2 italic shrink-0">
            {data.serpCaptions?.before2 || 'AI Result - Before'}
          </p>
        </div>
      </SlideWrapper>

      {/* Slide 7: AI Result - After */}
      <SlideWrapper>
        <div className="flex flex-col h-full bg-white p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-[#0f172a] uppercase mb-6 text-left">
            AI RESULT - AFTER
          </h2>
          
          {/* Content */}
          <div className="flex-1 min-h-0">
            {data.serpScreenshotAfter2 && data.serpScreenshotAfter2.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 h-full">
                {data.serpScreenshotAfter2.slice(0, 3).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                     <img 
                       src={src} 
                       alt={`AI Result After ${i+1}`} 
                       className="w-full h-full object-cover object-top"
                     />
                   </div>
                ))}
                {/* Fill empty slots if less than 3 images to maintain grid structure */}
                {[...Array(Math.max(0, 3 - data.serpScreenshotAfter2.length))].map((_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50 border border-dashed border-gray-200 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm text-gray-400">No screenshot uploaded (AI Result After)</p>
              </div>
            )}
          </div>
        </div>
      </SlideWrapper>

      {/* Slide 6: Data Summary */}
      <SlideWrapper>
        <SlideHeader title="DATA SUMMARY" pageNum={8} />
        <div className="p-4">
          <h4 className="text-xs font-semibold mb-2" style={{ color: REPORT_COLORS.primary }}>
            Keyword Analysis
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="grid grid-cols-3 text-xs font-medium text-white p-2"
              style={{ backgroundColor: REPORT_COLORS.primary }}
            >
              <span>Keyword</span>
              <span>Type</span>
              <span>Results</span>
            </div>
            {data.keywords.slice(0, 3).map((keyword, i) => (
              <div key={i} className={`grid grid-cols-3 text-xs p-2 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                <span>{keyword}</span>
                <span className="text-green-600">Brand</span>
                <span>-</span>
              </div>
            ))}
            {data.negativeKeywords.slice(0, 3).map((keyword, i) => (
              <div key={i} className={`grid grid-cols-3 text-xs p-2 ${(data.keywords.slice(0, 3).length + i) % 2 === 0 ? 'bg-muted/30' : ''}`}>
                <span>{keyword}</span>
                <span className="text-red-600">Negative</span>
                <span>-</span>
              </div>
            ))}
          </div>
        </div>
      </SlideWrapper>

      {/* Optional: Social Media Stats */}
      {data.socialMediaStats.length > 0 && (
        <SlideWrapper>
          <SlideHeader title="SOCIAL MEDIA STATISTICS" pageNum={9} />
          <div className="p-4 grid grid-cols-2 gap-2">
            {data.socialMediaStats.slice(0, 4).map((stat, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-2">
                <h5 className="font-medium text-xs" style={{ color: REPORT_COLORS.primary }}>
                  {stat.platform}
                </h5>
                <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-muted-foreground">
                  <span>Views: {stat.views.toLocaleString()}</span>
                  <span>Likes: {stat.likes.toLocaleString()}</span>
                  <span>Comments: {stat.comments.toLocaleString()}</span>
                  <span>Shares: {stat.shares.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </SlideWrapper>
      )}

      {/* Optional: Counter Content */}
      {data.counterContent.length > 0 && (
        <SlideWrapper>
          <SlideHeader title="COUNTER NARRATIVE CONTENT" pageNum={10} />
          <div className="p-4 space-y-2">
            {data.counterContent.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span 
                  className="text-xs px-2 py-0.5 rounded text-white"
                  style={{ 
                    backgroundColor: item.type === 'news' ? REPORT_COLORS.accent : 
                                    item.type === 'social' ? REPORT_COLORS.positive : REPORT_COLORS.neutral 
                  }}
                >
                  {item.type.toUpperCase()}
                </span>
                <span className="text-xs truncate flex-1">{item.title}</span>
              </div>
            ))}
          </div>
        </SlideWrapper>
      )}
    </div>
  );
};

// Helper Components
const SlideWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative bg-background border border-border rounded-lg overflow-hidden shadow-sm" style={{ aspectRatio: '16/9' }}>
    <div className="absolute inset-0 flex flex-col">
      {children}
    </div>
  </div>
);

const SlideHeader = ({ title, pageNum }: { title: string; pageNum: number }) => (
  <div 
    className="flex items-center justify-between px-4 py-2 text-white"
    style={{ backgroundColor: REPORT_COLORS.primary }}
  >
    <span className="font-semibold text-sm">{title}</span>
    <span className="text-xs opacity-70">{pageNum}</span>
  </div>
);

const StatusBadge = ({ status }: { status: 'recovery' | 'monitoring' | 'crisis' }) => {
  const colors = {
    recovery: REPORT_COLORS.positive,
    monitoring: REPORT_COLORS.neutral,
    crisis: REPORT_COLORS.negative,
  };
  return (
    <span 
      className="inline-block px-2 py-0.5 rounded text-xs text-white font-medium"
      style={{ backgroundColor: colors[status] }}
    >
      {status.toUpperCase()}
    </span>
  );
};

const SentimentBadge = ({ status }: { status: 'positive' | 'neutral' | 'negative' }) => {
  const colors = {
    positive: REPORT_COLORS.positive,
    neutral: REPORT_COLORS.neutral,
    negative: REPORT_COLORS.negative,
  };
  return (
    <span 
      className="inline-block px-2 py-0.5 rounded text-xs text-white font-medium"
      style={{ backgroundColor: colors[status] }}
    >
      {status.toUpperCase()}
    </span>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div 
    className="rounded-lg p-2 text-center text-white"
    style={{ backgroundColor: color }}
  >
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs opacity-80">{label}</p>
  </div>
);

export default ReportPreview;
