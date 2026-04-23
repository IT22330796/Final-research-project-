import { Routes, Route, Link } from 'react-router-dom'
import ImageUpload from './diagnosis/ImageUpload'
import DiagnosisResults from './diagnosis/DiagnosisResults'
import PatientsListForDiagnosis from './diagnosis/PatientsListForDiagnosis'

function Diagnosis() {
  return (
    <Routes>
      <Route path="/:disease/:type/results" element={<DiagnosisResults />} />
      <Route path="/:disease/upload" element={<ImageUpload />} />
      <Route path="/:disease" element={<PatientsListForDiagnosis />} />
      <Route path="/" element={<DiagnosisOverview />} />
    </Routes>
  )
}

function DiagnosisOverview() {
  const diseases = [
    {
      name: 'Digestive',
      path: '/diagnose/digestive',
      description: 'Conditions affecting the digestive system and gastrointestinal tract',
      count: 45,
      severity: 'moderate',
      icon: '🩺',
    },
    {
      name: 'Spinal',
      path: '/diagnose/spinal',
      description: 'Spinal cord and vertebral column related conditions',
      count: 32,
      severity: 'high',
      icon: '🦴',
    },
    {
      name: 'Liver',
      path: '/diagnose/liver',
      description: 'Liver function and hepatic system disorders',
      count: 67,
      severity: 'low',
      icon: '🔬',
    },
    {
      name: 'Health Check',
      path: '/diagnose/health-check',
      description: 'Quick check to identify whether an image looks healthy or abnormal',
      count: 0,
      severity: 'low',
      icon: '✅',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disease Diagnosis & Monitoring</h1>
        <p className="text-gray-600 mt-1">Monitor and manage patient diagnoses across different medical conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diseases.map((disease) => (
          <Link
            key={disease.name}
            to={disease.path}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{disease.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{disease.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{disease.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Cases</p>
                    <p className="text-2xl font-bold text-gray-900">{disease.count}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    disease.severity === 'low' ? 'bg-green-100 text-green-800' :
                    disease.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Diagnosis

