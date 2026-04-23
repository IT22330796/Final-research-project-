function MedicalHistoryTab({ patient }) {
  const patientName = patient
    ? [patient.firstName, patient.lastName].filter(Boolean).join(' ') || '—'
    : null

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Medical History</h3>
            {patientName && (
              <p className="text-sm text-gray-600 mt-1">Patient: {patientName}</p>
            )}
          </div>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Add Record
          </button>
        </div>

        {!patient && (
          <div className="text-center py-8 text-gray-500 text-sm mb-6">
            No patient selected. Patient-specific medical history will appear here when a patient is selected.
          </div>
        )}

        <div className="space-y-6">
          {/* Allergies */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Allergies
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Penicillin</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Sulfa Drugs</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Latex</span>
              </div>
              <p className="text-xs text-red-700 mt-2">Reactions: Rash, difficulty breathing</p>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Chronic Conditions
            </h4>
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Type 2 Diabetes</p>
                    <p className="text-sm text-gray-600 mt-1">Diagnosed: 2018 | Status: Controlled with medication</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">Active</span>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Hypertension</p>
                    <p className="text-sm text-gray-600 mt-1">Diagnosed: 2020 | Status: Well controlled</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Current Medications
            </h4>
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Metformin 500mg</p>
                    <p className="text-sm text-gray-600">Twice daily with meals | Started: 2018</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Active</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Lisinopril 10mg</p>
                    <p className="text-sm text-gray-600">Once daily | Started: 2020</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Surgeries */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Previous Surgeries
            </h4>
            <div className="space-y-2">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Appendectomy</p>
                    <p className="text-sm text-gray-600">Date: March 15, 2005 | Surgeon: Dr. Smith</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Family History */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Family History
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Father:</span>
                  <span className="text-sm text-gray-700">Type 2 Diabetes, Heart Disease (deceased at 72)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Mother:</span>
                  <span className="text-sm text-gray-700">Hypertension, Osteoporosis</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Siblings:</span>
                  <span className="text-sm text-gray-700">One brother with Type 2 Diabetes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Lab Results */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recent Lab Results
            </h4>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">HbA1c</p>
                  <p className="text-sm font-semibold text-gray-900">6.8%</p>
                  <p className="text-xs text-gray-500">Jan 2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Blood Pressure</p>
                  <p className="text-sm font-semibold text-gray-900">128/82</p>
                  <p className="text-xs text-gray-500">Jan 2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cholesterol</p>
                  <p className="text-sm font-semibold text-gray-900">195 mg/dL</p>
                  <p className="text-xs text-gray-500">Dec 2023</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Creatinine</p>
                  <p className="text-sm font-semibold text-gray-900">1.1 mg/dL</p>
                  <p className="text-xs text-gray-500">Dec 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalHistoryTab

