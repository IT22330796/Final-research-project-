import { forwardRef } from 'react'

const PatientReportPDF = forwardRef(function PatientReportPDF({
  patientData,
  aiAssessment,
  image,
  prescribedMedicine,
  recommendedTests,
  clinicalNotes,
  disease
}, ref) {

  // Normalize patient data - support both API shape (firstName, lastName) and legacy shape (name)
  const normalizePatient = (data) => {
    if (!data) return null
    const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ') || '—'
    let age = data.age
    if (!age && data.dateOfBirth) {
      const d = new Date(data.dateOfBirth)
      age = isNaN(d.getTime()) ? '—' : `${new Date().getFullYear() - d.getFullYear()} years`
    }
    return {
      id: data._id || data.id || '—',
      name,
      age: age ?? '—',
      gender: data.gender ?? '—',
      phone: data.phone ?? '—',
      email: data.email ?? '—',
      bloodType: data.bloodType ?? '—',
      height: data.height ?? '—',
      weight: data.weight ?? '—',
      bmi: data.bmi ?? '—',
      status: data.status ?? '—',
    }
  }

  const patient = normalizePatient(patientData) || {
    id: '—',
    name: '—',
    age: '—',
    gender: '—',
    phone: '—',
    email: '—',
    bloodType: '—',
    height: '—',
    weight: '—',
    bmi: '—',
    status: '—',
  }

  // Function to get disease-specific diagnosis name
  const getDiseaseDiagnosisName = (diseaseType) => {
    const diseaseLower = diseaseType?.toLowerCase() || ''

    const diagnosisMap = {
      'dr': 'PDR',
      'amd': 'No AMD',
      'rvo': 'No RVO',
      'glaucoma': 'No Glaucoma',
      'digestive': 'Digestive',
      'spinal': 'Spinal',
      'liver': 'Liver'
    }

    if (diagnosisMap[diseaseLower]) {
      return diagnosisMap[diseaseLower]
    } else if (diseaseType) {
      return diseaseType.charAt(0).toUpperCase() + diseaseType.slice(1).toLowerCase()
    }

    return 'No Diagnosis'
  }

  // Get current disease diagnosis name
  const currentDiseaseName = getDiseaseDiagnosisName(disease)

  // Mock diagnosis history - using disease-specific names
  const diagnosisHistory = [
    { date: '3/20/2025', diagnosis: currentDiseaseName, eye: 'LEFT', confidence: '0.8%', doctor: 'Dr. N/A' },
    { date: '3/15/2025', diagnosis: currentDiseaseName, eye: 'LEFT', confidence: '0.0%', doctor: 'Dr. N/A' },
    { date: '3/10/2025', diagnosis: currentDiseaseName, eye: 'LEFT', confidence: '0.8%', doctor: 'Dr. N/A' },
    { date: '3/5/2025', diagnosis: currentDiseaseName, eye: 'LEFT', confidence: '0.0%', doctor: 'Dr. N/A' },
  ]

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })
  const formattedDateTime = currentDate.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  const reportId = `RPT-${patient.id}-${Math.floor(Math.random() * 1000000)}`

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-4 border-indigo-600">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-t-lg mb-4">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Patient Report</h1>
          <p className="text-lg font-medium opacity-95">Patient Health Report</p>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Generated on <span className="font-semibold">{formattedDate}</span> - Report ID: <span className="font-semibold text-indigo-600">{reportId}</span>
        </p>
      </div>

      {/* Patient Profile Section */}
      <div className="border-2 border-blue-200 rounded-lg mb-6 relative shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">👤</span>
            Patient Profile
          </h2>
        </div>
        <div className="bg-blue-50 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">ID:</span>
                <span className="text-gray-800">{patient.id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Name:</span>
                <span className="text-gray-800 font-medium">{patient.name}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Age/Gender:</span>
                <span className="text-gray-800">{patient.age} y/o {patient.gender}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Phone:</span>
                <span className="text-gray-800">{patient.phone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Email:</span>
                <span className="text-gray-800">{patient.email}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Blood:</span>
                <span className="text-gray-800 font-medium">{patient.bloodType}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">Height/Weight:</span>
                <span className="text-gray-800">{patient.height} / {patient.weight}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-semibold min-w-[100px]">BMI:</span>
                <span className="text-gray-800 font-medium">{patient.bmi}</span>
              </div>
            </div>
          </div>
        </div>
        <span className="absolute top-4 right-6 px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
          ✓ {patient.status}
        </span>
      </div>

      {/* Latest Assessment Section */}
      <div className="border-2 border-purple-200 rounded-lg mb-6 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">🔍</span>
            Latest Assessment
          </h2>
        </div>
        <div className="bg-purple-50 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex justify-center items-center">
              {image && (
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <img
                    src={image}
                    alt="Scan"
                    className="w-full max-w-md h-auto rounded-lg border-2 border-purple-200"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Diagnosis:</p>
                <p className={`text-2xl font-bold mb-2 ${aiAssessment?.diagnosis === 'No AMD' ||
                    aiAssessment?.diagnosis === 'No RVO' ||
                    aiAssessment?.diagnosis?.toLowerCase().includes('no') ||
                    aiAssessment?.diagnosis?.toLowerCase().includes('normal') ||
                    aiAssessment?.diagnosis?.toLowerCase().includes('healthy')
                    ? 'text-green-600'
                    : 'text-red-600'
                  }`}>
                  {aiAssessment?.diagnosis || 'No Diagnosis'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1"><strong>Assessment Date:</strong> <span className="text-gray-800">{formattedDate}</span></p>
                {aiAssessment?.confidence && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Confidence Level:</strong>
                    <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-semibold">
                      {aiAssessment.confidence}%
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Care Recommendations Section */}
      <div className="border-2 border-green-200 rounded-lg mb-6 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">💊</span>
            Care Recommendations
          </h2>
        </div>
        <div className="bg-green-50 p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-800"><strong className="text-gray-700">Follow-up Exams:</strong> Every 3-6 months recommended</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-800"><strong className="text-gray-700">Health Monitoring:</strong> Routine checks as per specialist advice</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-800"><strong className="text-gray-700">Lifestyle:</strong> Balanced diet and regular exercise</span>
            </li>
            {prescribedMedicine && (
              <li className="flex items-start bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <span className="text-indigo-600 mr-3 font-bold">•</span>
                <span className="text-gray-800"><strong className="text-indigo-700">Prescribed Medicine:</strong> {prescribedMedicine}</span>
              </li>
            )}
            {recommendedTests && recommendedTests.filter(t => t.trim()).length > 0 && (
              <li className="flex items-start bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <span className="text-indigo-600 mr-3 font-bold">•</span>
                <span className="text-gray-800"><strong className="text-indigo-700">Recommended Tests:</strong> {recommendedTests.filter(t => t.trim()).join(', ')}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Validation/Notes Section */}
      <div className="border-2 border-orange-200 rounded-lg mb-6 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">📋</span>
            Notes & Validation
          </h2>
        </div>
        <div className="bg-orange-50 p-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
            {clinicalNotes && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Clinical Notes:</p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{clinicalNotes}</p>
              </div>
            )}
            {aiAssessment?.validation_report && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-indigo-700 mb-2">Doctor Referral Validation:</p>
                <p className="text-sm text-gray-800 bg-indigo-50 p-3 rounded whitespace-pre-wrap">{aiAssessment.validation_report}</p>
              </div>
            )}
            {!clinicalNotes && !aiAssessment?.validation_report && (
              <p className="text-sm text-gray-500 italic">No additional notes or validation reports available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-4 border-indigo-600 pt-6 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 py-6 rounded-lg">
        <p className="text-sm text-gray-700 mb-2 font-medium">Consult your healthcare provider for medical advice</p>
        <p className="text-xs text-gray-600 bg-white px-4 py-2 rounded inline-block border border-gray-300">
          <strong>Generated:</strong> {formattedDateTime} - <span className="text-red-600 font-bold">CONFIDENTIAL MEDICAL RECORD</span>
        </p>
      </div>
    </div>
  )
})

export default PatientReportPDF
