import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

function IrisResult() {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('results')
    const [prescribedMedicine, setPrescribedMedicine] = useState('')
    const [recommendedTests, setRecommendedTests] = useState([''])
    const [clinicalNotes, setClinicalNotes] = useState('')
    const [animatedConfidence, setAnimatedConfidence] = useState(0)

    // Get image from navigation state or use placeholder
    const image = location.state?.image || 'https://via.placeholder.com/400x400?text=Medical+Scan'

    // Mock AI Assessment data
    const aiAssessment = {
        diagnosis: 'PDR',
        confidence: 92,
        recommendation: 'Advanced signs detected. Immediate specialist consultation recommended.',
    }

    const confidenceValue = aiAssessment.confidence

    const animationRef = useRef(null)
    const hasAnimatedRef = useRef(false)

    // Animate confidence bar on mount
    useEffect(() => {
        if (activeTab === 'results' && !hasAnimatedRef.current) {
            // Cancel any existing animation
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }

            // Start animation after a brief delay
            const timeoutId = setTimeout(() => {
                // Animate from 0 to target value over 2 seconds
                const duration = 2000 // 2 seconds
                const startTime = Date.now()

                const animate = () => {
                    const elapsed = Date.now() - startTime
                    const progress = Math.min(elapsed / duration, 1)

                    // Ease-out animation function
                    const easeOut = 1 - Math.pow(1 - progress, 3)
                    setAnimatedConfidence(easeOut * confidenceValue)

                    if (progress < 1) {
                        animationRef.current = requestAnimationFrame(animate)
                    } else {
                        animationRef.current = null
                        hasAnimatedRef.current = true
                    }
                }

                animationRef.current = requestAnimationFrame(animate)
            }, 100)

            return () => {
                clearTimeout(timeoutId)
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current)
                }
            }
        } else if (activeTab !== 'results') {
            // Reset when switching away from results tab
            hasAnimatedRef.current = false
            setTimeout(() => {
                setAnimatedConfidence(0)
            }, 0)
        }
    }, [activeTab, confidenceValue])

    const handleNewScan = () => {
        navigate(`/iris/detection`)
    }

    const handleSavePrescription = () => {
        // TODO: Implement save functionality
        const prescriptionData = {
            prescribedMedicine,
            recommendedTests: recommendedTests.filter((test) => test.trim() !== ''),
            clinicalNotes,
        }
        console.log('Saving prescription:', prescriptionData)
        alert('Prescription saved successfully!')
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Top Action Buttons */}
            <div className="flex justify-end space-x-3 mb-4">
                <button
                    onClick={handleNewScan}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>New Scan</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1  mt-4">
                {activeTab === 'results' && (

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">

                        {/* <div className="flex flex-col h-full"> */}
                        <div className="flex flex-col h-full lg:col-span-8">

                            <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-5 flex flex-col h-full">

                                <img
                                    src={image}
                                    alt="Preview"
                                    className="max-w-md mx-auto rounded-lg shadow-md"
                                    style={{ height: 250 }}
                                />

                                {/* Title */}
                                <div className="flex items-center gap-2 mb-4 mt-2">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4"
                                        />
                                    </svg>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Analysis Completed Successfully
                                    </h3>
                                </div>

                                {/* Process Steps */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 flex items-center justify-center 
                         bg-green-500 text-white rounded-full text-xs">
                                            ✓
                                        </span>
                                        <p className="text-xs font-medium text-green-700">
                                            Image Validation – Passed
                                        </p>
                                    </div>

                                    <div className="ml-3 h-4 w-px bg-green-300"></div>

                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 flex items-center justify-center 
                         bg-green-500 text-white rounded-full text-xs">
                                            ✓
                                        </span>
                                        <p className="text-xs font-medium text-green-700">
                                            Iris Status – No Abnormal Indicators Detected
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-green-200 mb-4"></div>

                                {/* Feedback */}
                                <div className="mt-auto">
                                    <p className="text-xs text-gray-600 mb-1">
                                        Feedback
                                    </p>
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        No significant abnormalities were detected in the scanned image.
                                        Disease-related indicators for liver, spinal, and digestive conditions were not identified.
                                    </p>
                                </div>

                            </div>

                        </div>



                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 
                flex flex-col h-full max-h-[600px]"> */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 
                flex flex-col h-full max-h-[600px] lg:col-span-4">


                            {/* Header */}
                            <h3 className="text-base font-semibold text-gray-900 mb-4">
                                Actions
                            </h3>

                            {/* Image Preview */}
                            <div className="flex justify-center mb-4">
                                <img
                                    src={image}
                                    alt="Medical Scan"
                                    className="max-h-40 w-auto rounded-lg border border-gray-200 object-contain"
                                />
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-center mb-5">
                                <button
                                    onClick={handleSavePrescription}
                                    className="flex items-center gap-2 px-4 py-2 
                 bg-gradient-to-r from-indigo-600 to-purple-600
                 text-white rounded-md text-xs font-medium
                 hover:from-indigo-700 hover:to-purple-700
                 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Download Report
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 mb-4"></div>

                            {/* Scan Details */}
                            <div className="mt-auto">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Scan Details
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Patient ID</span>
                                        <span className="text-gray-700 font-medium">#PID1212</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Scan Date</span>
                                        <span className="text-gray-700 font-medium">2026/1/1</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Scan Type</span>
                                        <span className="text-gray-700 font-medium">Normal</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Contact No</span>
                                        <span className="text-gray-700 font-medium">0712345678</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}

export default IrisResult

