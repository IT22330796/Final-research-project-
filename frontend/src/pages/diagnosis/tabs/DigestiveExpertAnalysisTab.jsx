
import { Box, Card, CardContent, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'

function DigestiveExpertAnalysisTab({ aiAssessment }) {
    if (!aiAssessment || !aiAssessment.validation_report) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-orange-100 p-4 rounded-full mb-4">
                    <svg className="w-12 h-12 text-orange-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Digestive Insights Pending</h3>
                <p className="text-gray-500 text-center max-w-sm mt-2">
                    The specialized medical visual analysis for the digestive system is still being processed or unavailable.
                </p>
            </div>
        )
    }

    // Helper to parse the validation report
    const sections = aiAssessment.validation_report.split('\n\n')

    const findSection = (keywords) => {
        return sections.find(s => keywords.some(k => s.includes(k))) || ''
    }

    const parseBulletPoints = (text) => {
        return text.split('\n').slice(1).map(line => line.replace('•', '').trim()).filter(l => l.length > 0)
    }

    const patterns = findSection(['Detected Visual Patterns'])
    const symptoms = findSection(['Identified Symptoms & Signs'])
    const risk = findSection(['Risk Level'])
    const checkup = findSection(['Suggested Specialist'])
    const tests = findSection(['Recommended Next Steps'])

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-6 pb-8">
            {/* Overview Card */}
            <Card className="border-none shadow-md bg-gradient-to-br from-orange-900 to-orange-800 text-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography variant="overline" className="text-orange-200 font-bold tracking-widest">
                                Digestive System Analysis
                            </Typography>
                            <Typography variant="h4" className="font-bold mt-1">
                                Expert Gastric Review
                            </Typography>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-center min-w-[100px]">
                            <Typography className="text-[10px] uppercase font-bold text-orange-100">Confidence Score</Typography>
                            <Typography variant="h5" className="font-black text-white">{Math.round(aiAssessment.confidence)}%</Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identified Symptoms & Signs */}
                <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-amber-200/50 p-4 border-b border-amber-200 flex items-center gap-3">
                        <span className="text-2xl">🦠</span>
                        <h3 className="text-lg font-bold text-amber-900">Digestive Indicators</h3>
                    </div>
                    <div className="p-5 flex-1">
                        <List spacing={2}>
                            {parseBulletPoints(symptoms).map((item, i) => (
                                <ListItem key={i} className="px-0 items-start">
                                    <ListItemIcon className="min-w-[30px] mt-1">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{ className: "text-sm font-semibold text-amber-900 leading-snug" }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>

                {/* Detected Patterns */}
                <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-200/50 p-4 border-b border-slate-200 flex items-center gap-3">
                        <span className="text-2xl">🔬</span>
                        <h3 className="text-lg font-bold text-slate-900">Visual Morphologies</h3>
                    </div>
                    <div className="p-5 flex-1">
                        <div className="space-y-4">
                            {parseBulletPoints(patterns).map((item, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <Typography className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">
                                        {item.split(':')[0]}
                                    </Typography>
                                    <Typography className="text-sm font-medium text-slate-800">
                                        {item.split(':').slice(1).join(':').trim()}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk & Recommendations */}
                <div className="bg-rose-50 rounded-2xl border-2 border-rose-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-rose-200/50 p-4 border-b border-rose-200 flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <h3 className="text-lg font-bold text-rose-900">Clinical Risk Level</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-200 shadow-sm">
                            <span className="text-sm font-bold text-rose-900 uppercase">Assessment Severity</span>
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${risk.toLowerCase().includes('high') ? 'bg-rose-600 text-white' :
                                risk.toLowerCase().includes('moderate') ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'
                                }`}>
                                {risk.replace('Risk Level', '').replace(':', '').trim() || 'Inconclusive'}
                            </span>
                        </div>

                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 shadow-sm">
                            <span className="block text-[10px] font-bold text-orange-900 uppercase mb-2">Suggested Specialist</span>
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-600 p-1 rounded-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-orange-900">
                                    {checkup.replace('Suggested Specialist', '').replace(':', '').replace('•', '').trim() || 'Gastroenterologist'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Tests */}
                <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-blue-200/50 p-4 border-b border-blue-200 flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <h3 className="text-lg font-bold text-blue-900">Recommended Diagnostics</h3>
                    </div>
                    <div className="p-5 flex-1">
                        <div className="flex flex-wrap gap-2">
                            {parseBulletPoints(tests).map((test, i) => (
                                <div key={i} className="px-4 py-2 bg-white rounded-full border border-blue-200 shadow-sm text-sm font-bold text-blue-700 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    {test}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Note Section */}
            <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 italic text-center">
                <Typography variant="body2" className="text-gray-500 text-xs">
                    This observation is generated by a specialized digestive validation model. It is intended for referral support and is NOT a definitive medical diagnosis. Professional medical review is mandatory.
                </Typography>
            </div>
        </div>
    )
}

export default DigestiveExpertAnalysisTab
