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
            
            <div className="grid grid-cols-2 gap-8">
              {/* Left: Aktivitas Akun Lawan */}
              <div className="space-y-1">
                <h4 className="font-bold text-[11px] text-black">Aktivitas Akun Lawan</h4>
                <ul className="space-y-1 list-none ml-1">
                  <li className="text-[10px] flex items-center gap-2 text-black">
                    <span className="h-1 w-1 rounded-full bg-black shrink-0" />
                    <span><span className="font-bold">Sebelum:</span> {data.socialMediaAccountStatusBefore || '-'}</span>
                  </li>
                  <li className="text-[10px] flex items-center gap-2 text-black">
                    <span className="h-1 w-1 rounded-full bg-black shrink-0" />
                    <span><span className="font-bold">Sesudah:</span> {data.socialMediaAccountStatusAfter || '-'}</span>
                  </li>
                </ul>
                {data.socialMediaAccountStatusNote && (
                  <p className="text-[10px] italic ml-4 text-black">
                    {data.socialMediaAccountStatusNote}
                  </p>
                )}
              </div>

              {/* Right: Aktivitas Counter Kita */}
              <div className="space-y-1">
                <h4 className="font-bold text-[11px] text-black">Aktivitas Counter Kita</h4>
                <ul className="space-y-1 list-none ml-1">
                  <li className="text-[10px] flex items-center gap-2 text-black">
                    <span className="h-1 w-1 rounded-full bg-black shrink-0" />
                    <span><span className="font-bold">Total views konten counter:</span> {data.socialMediaCounterTotalViews || '-'}</span>
                  </li>
                  <li className="text-[10px] flex items-center gap-2 text-black">
                    <span className="h-1 w-1 rounded-full bg-black shrink-0" />
                    <span><span className="font-bold">Total engagement:</span> {data.socialMediaCounterTotalEngagement || '-'}</span>
                  </li>
                </ul>
              </div>
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
              <div className={`grid gap-4 h-full ${
                data.serpScreenshotAfter.length === 1 ? 'grid-cols-1' :
                data.serpScreenshotAfter.length === 2 ? 'grid-cols-2' :
                data.serpScreenshotAfter.length === 3 ? 'grid-cols-3' :
                data.serpScreenshotAfter.length === 4 ? 'grid-cols-2 grid-rows-2' :
                data.serpScreenshotAfter.length <= 6 ? 'grid-cols-3 grid-rows-2' :
                'grid-cols-4 grid-rows-2'
              }`}>
                {data.serpScreenshotAfter.slice(0, 8).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex items-center justify-center bg-slate-50">
                     <img 
                       src={src} 
                       alt={`After screenshot ${i+1}`} 
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
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
              <div className={`grid gap-4 h-full ${
                data.serpScreenshotAfter2.length === 1 ? 'grid-cols-1' :
                data.serpScreenshotAfter2.length === 2 ? 'grid-cols-2' :
                data.serpScreenshotAfter2.length === 3 ? 'grid-cols-3' :
                data.serpScreenshotAfter2.length === 4 ? 'grid-cols-2 grid-rows-2' :
                data.serpScreenshotAfter2.length <= 6 ? 'grid-cols-3 grid-rows-2' :
                'grid-cols-4 grid-rows-2'
              }`}>
                {data.serpScreenshotAfter2.slice(0, 8).map((src, i) => (
                   <div key={i} className="relative w-full h-full min-h-0 bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex items-center justify-center bg-slate-50">
                     <img 
                       src={src} 
                       alt={`AI Result After ${i+1}`} 
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
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

      {/* Slide 8: Appendix Divider */}
      <SlideWrapper>
        <div 
          className="h-full flex flex-col items-center justify-center text-white"
          style={{ backgroundColor: '#0f172a' }} // Dark navy background
        >
          <h2 className="text-4xl font-bold uppercase tracking-wide">APPENDIX</h2>
        </div>
      </SlideWrapper>

      {/* Slide 9: Data Summary */}
      <SlideWrapper>
        <SlideHeader title="DATA SUMMARY" pageNum={9} />
        <div className="p-4 flex flex-col h-full overflow-hidden">
          
          {/* 1. Keyword Analysis Table */}
          <div className="mb-4 flex-1 min-h-0">
            <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: REPORT_COLORS.primary }}>
              Keyword Analysis
            </h4>
            <div className="border rounded-t-lg overflow-hidden">
              <div 
                className="grid grid-cols-5 text-[10px] font-bold text-white p-2 gap-1"
                style={{ backgroundColor: REPORT_COLORS.primary }}
              >
                <span className="col-span-1">Keyword</span>
                <span className="text-center">Search (Before)</span>
                <span className="text-center">News (Before)</span>
                <span className="text-center">Search (Current)</span>
                <span className="text-center">News (Current)</span>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[120px] border-x border-b rounded-b-lg">
              {data.keywordStats && data.keywordStats.length > 0 ? (
                data.keywordStats.map((stat, i) => (
                  <div key={i} className={`grid grid-cols-5 text-[10px] p-2 gap-1 border-b last:border-0 items-center ${i % 2 === 0 ? 'bg-muted/20' : 'bg-white'}`}>
                    <span className="col-span-1 font-medium truncate">{stat.keyword}</span>
                    <span className={`text-center ${stat.searchBefore === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.searchBefore}
                    </span>
                    <span className={`text-center ${stat.newsBefore === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.newsBefore}
                    </span>
                    <span className={`text-center ${stat.searchCurrent === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.searchCurrent}
                    </span>
                    <span className={`text-center ${stat.newsCurrent === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.newsCurrent}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[10px] text-muted-foreground italic">
                  No keyword data available
                </div>
              )}
            </div>
          </div>

          {/* 2. Production Stats Table */}
          <div className="mb-2 shrink-0">
            <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: REPORT_COLORS.positive }}>
              Konten yang diproduksi
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="grid grid-cols-5 text-[10px] font-bold text-white p-2 text-center"
                style={{ backgroundColor: REPORT_COLORS.positive }}
              >
                <span>Views</span>
                <span>Like</span>
                <span>Comment</span>
                <span>Saved</span>
                <span>Share</span>
              </div>
              <div className="grid grid-cols-5 text-xs p-3 text-center bg-green-50 font-semibold">
                <span>{data.productionStats?.views || '0'}</span>
                <span>{data.productionStats?.likes || '0'}</span>
                <span>{data.productionStats?.comments || '0'}</span>
                <span>{data.productionStats?.saved || '0'}</span>
                <span>{data.productionStats?.shares || '0'}</span>
              </div>
            </div>
          </div>
          
        </div>
      </SlideWrapper>

      {/* Slide 10: Content Production Summary */}
      {data.contentProduction && (
        <SlideWrapper>
          <SlideHeader title="PRODUKSI & DISTRIBUSI KONTEN" pageNum={10} />
          <div className="p-8 flex h-full overflow-hidden text-black gap-8">
            
            {/* Left Column: News */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-xl font-medium">News</h3>
              
              <div className="space-y-4 text-xs">
                {/* 1. Action */}
                <div className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <p>{data.contentProduction.newsAction}</p>
                </div>
                
                {/* 2. Results */}
                <div className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <div className="flex-1">
                    <p className="font-bold mb-1">Results:</p>
                    <div className="pl-4 space-y-1">
                      {data.contentProduction.newsResults.split('\n').map((line, i) => (
                        <div key={i} className="flex gap-2">
                           <span className="mt-1.5 h-1.5 w-1.5 bg-black shrink-0" />
                           <p>{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Social Media */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-xl font-medium">Social Media</h3>
              
              <div className="space-y-4 text-xs">
                {/* 1. Action */}
                <div className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <p>{data.contentProduction.socialAction}</p>
                </div>
                
                {/* 2. Results */}
                <div className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <div className="flex-1">
                    <p className="font-bold mb-1">Results:</p>
                    <div className="pl-4">
                      {data.contentProduction.socialResults.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Followup */}
                <div className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <div className="flex-1">
                    <p className="font-bold mb-1">Followup</p>
                    <div className="pl-4">
                       {data.contentProduction.socialFollowup.split('\n').map((line, i) => {
                          const isListItem = line.match(/^[a-z]\./);
                          return (
                            <div key={i} className="flex gap-1">
                               {!isListItem && <span>a.</span>}
                               <p>{line}</p>
                            </div>
                          );
                       })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </SlideWrapper>
      )}

      {/* Optional: Social Media Stats */}
      {data.socialMediaStats?.length > 0 && (
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
      {data.counterContent?.length > 0 && (
        <SlideWrapper>
          <SlideHeader title="COUNTER NARRATIVE CONTENT" pageNum={11} />
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

      {/* Production Links - News */}
      {data.newsProduction?.length > 0 && (
        <SlideWrapper>
          <SlideHeader title="PRODUCTION RESULTS - NEWS" pageNum={12} />
          <div className="p-8 flex flex-col h-full overflow-hidden">
             <div className="border border-indigo-600 text-[8px] flex-1 overflow-y-auto">
                {/* Header */}
                <div className="flex bg-indigo-600 text-white font-bold sticky top-0 z-10">
                   <div className="p-2 w-[70%] border-r border-white/20">Link</div>
                   <div className="p-2 w-[30%]">Media</div>
                </div>
                {/* Content Rows */}
                <div className="flex flex-col">
                   {data.newsProduction.map((link, i) => (
                      <div key={i} className="flex border-b border-indigo-100 last:border-0 hover:bg-muted/20">
                         <div className="p-2 w-[70%] border-r border-indigo-100 break-all text-blue-700 underline">
                            {link.url}
                         </div>
                         <div className="p-2 w-[30%] text-black truncate font-medium">
                            {link.platform || '-'}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </SlideWrapper>
      )}

      {/* Production Links - Social Media */}
      {data.socialMediaProduction?.length > 0 && (
        <>
          {Array.from({ length: Math.ceil(data.socialMediaProduction.length / 40) }).map((_, pageIndex) => {
            const chunk = data.socialMediaProduction.slice(pageIndex * 40, (pageIndex + 1) * 40);
            return (
              <SlideWrapper key={`social-prod-${pageIndex}`}>
                <SlideHeader 
                  title={pageIndex === 0 ? "SOCIAL MEDIA PRODUCTION LINKS" : "SOCIAL MEDIA PRODUCTION LINKS (Cont.)"} 
                  pageNum={13 + pageIndex} 
                />
                <div className="p-8 flex flex-col h-full overflow-hidden">
                   <div className="border border-black text-[8px] flex-1">
                      {/* Header */}
                      <div className="grid grid-cols-4 bg-[#14532d] text-white font-bold text-center">
                         <div className="p-2 border-r border-white/20">Link</div>
                         <div className="p-2 border-r border-white/20">Link</div>
                         <div className="p-2 border-r border-white/20">Link</div>
                         <div className="p-2">Link</div>
                      </div>
                      {/* Content Grid */}
                      <div className="grid grid-cols-4">
                         {chunk.map((link, i) => (
                            <div key={i} className="p-2 border-b border-r border-black/10 break-all text-blue-700 underline hover:bg-muted/20 truncate">
                               {link.url}
                            </div>
                         ))}
                         {/* Fill empty cells to maintain grid if needed, or just leave blank */}
                      </div>
                   </div>
                </div>
              </SlideWrapper>
            );
          })}
        </>
      )}
      {/* Last: Lampiran */}
      {data.lampiranImages?.length > 0 && (
        <>
          {data.lampiranImages.map((src, i) => (
            <SlideWrapper key={`lampiran-${i}`}>
              <div className="flex flex-col h-full bg-white p-8">
                {/* Title */}
                <h2 className="text-3xl font-bold text-[#0f172a] uppercase mb-6 text-left">
                  LAMPIRAN
                </h2>
                
                {/* Content */}
                <div className="flex-1 min-h-0 bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden relative">
                   <img 
                     src={src} 
                     alt={`Lampiran ${i+1}`} 
                     className="w-full h-full object-contain"
                   />
                </div>
              </div>
            </SlideWrapper>
          ))}
        </>
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
