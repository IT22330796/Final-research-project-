function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return '—'
  const d = new Date(dateOfBirth)
  if (isNaN(d.getTime())) return '—'
  const today = new Date()
  const age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) return `${age - 1} years`
  return `${age} years`
}

function PatientInfoTab({ patient }) {
  const fullName = patient
    ? [patient.firstName, patient.lastName].filter(Boolean).join(' ') || '—'
    : '—'

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Patient Information</h3>
          {patient && (
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Information
            </button>
          )}
        </div>

        {!patient ? (
          <div className="text-center py-12 text-gray-500">
            <p>No patient selected. Select a patient from the diagnosis flow to view details.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {patient._id || patient.id || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{fullName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(patient.dateOfBirth)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {getAge(patient.dateOfBirth)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {patient.status || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {patient.condition || '—'}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {patient.phone || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {patient.email || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(patient.lastVisit)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(patient.nextAppointment)}
              </p>
            </div>
          </div>

                  </div>
        )}
      </div>
    </div>
  )
}

export default PatientInfoTab

