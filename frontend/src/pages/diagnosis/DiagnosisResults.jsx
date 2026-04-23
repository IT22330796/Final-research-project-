import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import DiagnosisResultTab from './tabs/DiagnosisResultTab'
import PatientInfoTab from './tabs/PatientInfoTab'
import MedicalHistoryTab from './tabs/MedicalHistoryTab'
import PastDiagnosesTab from './tabs/PastDiagnosesTab'
import LiverExpertAnalysisTab from './tabs/LiverExpertAnalysisTab'
import DigestiveExpertAnalysisTab from './tabs/DigestiveExpertAnalysisTab'
import ConfirmationModal from '../../components/ConfirmationModal'
import SuccessMessage from '../../components/SuccessMessage'
import PatientReportPDF from '../../components/PatientReportPDF'
import PDFPreviewModal from '../../components/PDFPreviewModal'
import { useDispatch } from 'react-redux'
import { createDiagnosisThunk } from '../../state/diagnosesSlice'

function DiagnosisResults() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { disease, type } = useParams()
  const [activeTab, setActiveTab] = useState('results')
  const [prescribedMedicine, setPrescribedMedicine] = useState('')
  const [recommendedTests, setRecommendedTests] = useState([''])
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showPDFReport, setShowPDFReport] = useState(false)
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const pdfReportRef = useRef(null)

  // Get image, aiResult, patient, eye, and original file from navigation state
  const image = location.state?.image || 'https://via.placeholder.com/400x400?text=Medical+Scan'
  const aiResult = location.state?.aiResult
  const patient = location.state?.patient || null
  const eye = location.state?.eye || 'LEFT'
  const imageFile = location.state?.file || null

  // Function to get disease-specific diagnosis
  const getDiseaseDiagnosis = (diseaseType) => {
    const diseaseLower = diseaseType?.toLowerCase() || ''

    const diagnosisMap = {
      'dr': 'PDR', // Proliferative Diabetic Retinopathy
      'amd': 'No AMD', // Age-related Macular Degeneration
      'rvo': 'No RVO', // Retinal Vein Occlusion
      'glaucoma': 'No Glaucoma',
      'digestive': 'Digestive',
      'spinal': 'Spinal',
      'liver': 'Liver',
      'health-check': 'Health Check',
    }

    // If not in map, capitalize first letter of disease name
    if (diagnosisMap[diseaseLower]) {
      return diagnosisMap[diseaseLower]
    } else if (diseaseType) {
      // Capitalize first letter and return disease name
      return diseaseType.charAt(0).toUpperCase() + diseaseType.slice(1).toLowerCase()
    }

    return 'No Diagnosis'
  }

  // Function to get disease-specific recommendation
  const getDiseaseRecommendation = (diseaseType, diagnosis) => {
    const diseaseLower = diseaseType?.toLowerCase() || ''
    const isNegative = diagnosis?.toLowerCase().includes('no') || diagnosis?.toLowerCase() === 'healthy' || diagnosis?.toLowerCase() === 'normal'

    if (isNegative) {
      const recommendations = {
        'dr': 'No signs of diabetic retinopathy detected. Continue regular monitoring.',
        'amd': 'No signs of age-related macular degeneration. Maintain regular eye exams.',
        'rvo': 'No signs of retinal vein occlusion. Continue routine monitoring.',
        'glaucoma': 'No signs of glaucoma detected. Regular eye pressure monitoring recommended.',
        'digestive': 'Digestive system assessment completed. Continue regular monitoring and follow-up as needed.',
        'spinal': 'Spinal condition assessment completed. Continue regular monitoring and follow-up as needed.',
        'liver': 'Liver function assessment completed. Continue regular monitoring and follow-up as needed.',
      }
      return recommendations[diseaseLower] || 'Assessment completed. Continue regular monitoring and follow-up as needed.'
    } else {
      const recommendations = {
        'dr': 'Advanced signs detected. Immediate specialist consultation recommended.',
        'amd': 'Signs of macular degeneration detected. Specialist evaluation recommended.',
        'rvo': 'Retinal vein occlusion signs detected. Urgent ophthalmologist consultation required.',
        'glaucoma': 'Glaucoma signs detected. Immediate specialist consultation and treatment required.',
        'digestive': 'Digestive system abnormalities detected. Specialist consultation recommended.',
        'spinal': 'Spinal abnormalities detected. Immediate specialist consultation recommended.',
        'liver': 'Liver function abnormalities detected. Specialist consultation and further evaluation required.',
      }
      return recommendations[diseaseLower] || 'Abnormalities detected. Specialist consultation recommended.'
    }
  }

  // Build AI Assessment from API result
  const getAiAssessment = () => {
    if (disease === 'digestive' && aiResult) {
      const pred = aiResult.prediction
      const conf = aiResult.confidence ?? 0
      // confidence is already returned as 0-100 from backend
      const confPercent = typeof conf === 'number' && conf <= 1 ? conf * 100 : conf
      const diagnosisLabel = pred === 'digestive' ? 'Digestive Abnormality Detected' : 'Normal — No Issues Found'
      const confidenceLevel = aiResult.confidence_level || ''
      const recommendation =
        pred === 'normal'
          ? `No signs of digestive abnormality detected (${confidenceLevel} confidence). Continue regular monitoring and follow-up as needed.`
          : `Digestive abnormality detected (${confidenceLevel} confidence). Specialist consultation recommended.`

      return {
        diagnosis: diagnosisLabel,
        confidence: confPercent,
        recommendation,
        isHealthy: pred === 'normal',
        validation_report: null,
        probabilities: aiResult.probabilities,
      }
    }

    if (disease === 'liver' && aiResult) {
      console.log('DiagnosisResults Liver aiResult:', aiResult);
      const pred = aiResult.prediction
      const status = aiResult.status // 'issue_detected' or 'no_issue'
      const conf = aiResult.confidence !== undefined ? aiResult.confidence : 0
      const confPercent = typeof conf === 'number' && conf <= 1 ? conf * 100 : conf

      const diagnosisLabel = status === 'issue_detected' ? 'Liver Issue Detected' : 'No Liver Issues Detected'
      const recommendation =
        status === 'no_issue'
          ? 'No signs of liver abnormality detected. Continue regular monitoring and follow-up as needed.'
          : 'Liver function abnormalities detected. Specialist consultation and further evaluation required.'

      return {
        diagnosis: diagnosisLabel,
        confidence: confPercent,
        isHealthy: status === 'no_issue',
        recommendation,
        validation_report: aiResult.validation_report,
        probabilities: aiResult.probabilities,
      }
    }

    if (disease === 'spinal' && aiResult) {
      const pred = aiResult.prediction
      const conf = aiResult.confidence ?? 0
      const confPercent = typeof conf === 'number' && conf <= 1 ? conf * 100 : conf
      const isDiseased = pred === 'diseased'
      const diagnosisLabel = isDiseased ? 'Spinal Abnormality' : 'Normal'
      let recommendation = isDiseased
        ? 'Spinal abnormalities detected. Immediate specialist consultation recommended.'
        : 'No signs of spinal abnormality detected. Continue regular monitoring.'

      if (aiResult.explanation) {
        recommendation += ` Reason: ${aiResult.explanation}`
      }

      return {
        diagnosis: diagnosisLabel,
        confidence: confPercent,
        recommendation,
        isHealthy: !isDiseased,
        probabilities: aiResult.probabilities,
      }
    }

    if (disease === 'health-check' && aiResult) {
      const pred = (aiResult.prediction || '').toLowerCase()
      const conf = aiResult.confidence ?? 0
      const confPercent = typeof conf === 'number' && conf <= 1 ? conf * 100 : conf
      const isHealthy = pred === 'normal' || pred.includes('normal') || pred === 'healthy'
      const diagnosisLabel = isHealthy ? 'Healthy' : 'Potential Issue'
      const recommendation = isHealthy
        ? 'Image appears healthy. Continue routine monitoring as needed.'
        : 'Potential issues detected. Further clinical evaluation recommended.'

      return {
        isHealthy,
        diagnosis: diagnosisLabel,
        confidence: confPercent,
        recommendation,
        probabilities: aiResult.probabilities,
      }
    }

    const baseDiagnosis = getDiseaseDiagnosis(disease)
    return {
      diagnosis: baseDiagnosis,
      confidence: 92,
      recommendation: getDiseaseRecommendation(disease, baseDiagnosis),
      probabilities: null,
    }
  }

  const aiAssessment = getAiAssessment()
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
    navigate(`/diagnose/${disease}/upload`, { state: { patient } })
  }

  const handleExportPDF = () => {
    setShowPDFPreview(true)
  }

  const handlePrintReport = () => {
    try {
      const previewElement = document.querySelector('[data-pdf-preview]')
      if (!previewElement) {
        alert('Error: Could not find report content to print')
        return
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to print the report')
        return
      }

      const content = previewElement.cloneNode(true)

      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n')
          } catch (e) {
            return ''
          }
        })
        .join('\n')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Report - Print</title>
            <style>
              ${styles}
              @media print {
                @page {
                  margin: 15mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (error) {
      console.error('Error printing report:', error)
      alert('Error printing report. Please try again.')
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setShowPDFReport(true)

      await new Promise(resolve => setTimeout(resolve, 500))

      const reportElement = pdfReportRef.current
      if (!reportElement) {
        alert('Error: Could not generate PDF report')
        setShowPDFReport(false)
        return
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const currentDate = new Date().toISOString().split('T')[0]
      const filename = `Patient_Report_${currentDate}.pdf`

      pdf.save(filename)

      setShowPDFReport(false)
      setShowPDFPreview(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
      setShowPDFReport(false)
      setShowPDFPreview(false)
    }
  }

  const handleAddTest = () => {
    setRecommendedTests([...recommendedTests, ''])
  }

  const handleTestChange = (index, value) => {
    const newTests = [...recommendedTests]
    newTests[index] = value
    setRecommendedTests(newTests)
  }

  const handleRemoveTest = (index) => {
    if (recommendedTests.length > 1) {
      const newTests = recommendedTests.filter((_, i) => i !== index)
      setRecommendedTests(newTests)
    }
  }

  const handleSavePrescription = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirmModal(false)
    setIsSaving(true)

    try {
      const payload = {
        disease,
        diagnosis: aiAssessment.diagnosis,
        eye,
        confidence: aiAssessment.confidence,
        status: 'Checked',
        prescribedMedicine,
        recommendedTests: recommendedTests.filter((test) => test.trim() !== ''),
        clinicalNotes,
        referralValidationReport: aiResult?.validation_report,
        imageFile,
        patientId: patient?._id || patient?.id,
      }

      const resultAction = await dispatch(createDiagnosisThunk(payload))
      if (createDiagnosisThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Error saving prescription')
      }
      setShowSuccessMessage(true)
    } catch (error) {
      console.error('Error saving diagnosis:', error)
      alert(error?.data?.message || error.message || 'Error saving prescription')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'results', name: 'Diagnosis Results', icon: '📊' },
    { id: 'patient', name: 'Patient Info', icon: '👤' },
    { id: 'history', name: 'Medical History', icon: '📋' },
    { id: 'past', name: 'Past Diagnoses', icon: '📄' },
  ]

  if (disease === 'liver') {
    tabs.push({ id: 'liver_expert', name: 'Expert Analysis', icon: '🔍' })
  }


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Action Buttons */}
      <div className="flex justify-end space-x-3 mb-4">
        <button
          onClick={handleNewScan}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>New Scan</span>
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden mt-4">
        {activeTab === 'results' && (
          <DiagnosisResultTab
            image={image}
            disease={disease}
            aiAssessment={aiAssessment}
            animatedConfidence={animatedConfidence}
            prescribedMedicine={prescribedMedicine}
            setPrescribedMedicine={setPrescribedMedicine}
            recommendedTests={recommendedTests}
            handleAddTest={handleAddTest}
            handleTestChange={handleTestChange}
            handleRemoveTest={handleRemoveTest}
            clinicalNotes={clinicalNotes}
            setClinicalNotes={setClinicalNotes}
            handleSavePrescription={handleSavePrescription}
          />
        )}

        {activeTab === 'patient' && <PatientInfoTab patient={patient} />}

        {activeTab === 'history' && <MedicalHistoryTab patient={patient} />}

        {activeTab === 'past' && <PastDiagnosesTab />}

        {activeTab === 'liver_expert' && disease === 'liver' && (
          <LiverExpertAnalysisTab aiAssessment={aiAssessment} />
        )}

        {activeTab === 'digestive_expert' && disease === 'digestive' && (
          <DigestiveExpertAnalysisTab aiAssessment={aiAssessment} />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save Prescription"
        message="Are you sure you want to save this prescription? This action cannot be undone."
      />

      {/* Success Message */}
      <SuccessMessage
        open={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        message={isSaving ? 'Saving prescription...' : 'Prescription saved successfully!'}
      />

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        open={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        onPrint={handlePrintReport}
        onDownload={handleDownloadPDF}
      >
        <PatientReportPDF
          patientData={patient}
          aiAssessment={aiAssessment}
          image={image}
          prescribedMedicine={prescribedMedicine}
          recommendedTests={recommendedTests}
          clinicalNotes={clinicalNotes}
          disease={disease}
        />
      </PDFPreviewModal>

      {/* PDF Report (hidden, used for PDF generation) */}
      {showPDFReport && (
        <div className="fixed inset-0 -z-10 opacity-0 pointer-events-none overflow-hidden" style={{ width: '210mm', left: '-9999px' }}>
          <PatientReportPDF
            ref={pdfReportRef}
            patientData={patient}
            aiAssessment={aiAssessment}
            image={image}
            prescribedMedicine={prescribedMedicine}
            recommendedTests={recommendedTests}
            clinicalNotes={clinicalNotes}
            disease={disease}
          />
        </div>
      )}
    </div>
  )
}

export default DiagnosisResults
