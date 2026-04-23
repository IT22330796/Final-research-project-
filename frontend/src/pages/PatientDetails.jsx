import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPatientsThunk } from '../state/patientsSlice'
import { fetchDiagnosesThunk } from '../state/diagnosesSlice'
import PatientInfoTab from './diagnosis/tabs/PatientInfoTab'

function getDiagnosisPatientId(diagnosis) {
  const p = diagnosis?.patient
  const pid = diagnosis?.patientId || diagnosis?.patient_id
  if (pid) return pid
  if (!p) return null
  if (typeof p === 'string') return p
  return p?._id || p?.id || null
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString()
}

function PatientDetails() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('patient') // patient | diagnoses

  const patientsState = useSelector((state) => state.patients)
  const diagnosesState = useSelector((state) => state.diagnoses)

  useEffect(() => {
    if (patientsState.status === 'idle') dispatch(fetchPatientsThunk())
    if (diagnosesState.status === 'idle') dispatch(fetchDiagnosesThunk())
  }, [dispatch, patientsState.status, diagnosesState.status])

  const patient = useMemo(() => {
    const items = patientsState.items || []
    return items.find((p) => p?._id === id || p?.id === id) || null
  }, [patientsState.items, id])

  const patientDiagnoses = useMemo(() => {
    const items = diagnosesState.items || []
    return items
      .filter((d) => {
        const pid = getDiagnosisPatientId(d)
        return pid === id || pid === patient?._id || pid === patient?.id
      })
      .sort((a, b) => {
        const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0
        const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0
        return bd - ad
      })
  }, [diagnosesState.items, id, patient?._id, patient?.id])

  const fullName = patient
    ? [patient.firstName, patient.lastName].filter(Boolean).join(' ') || 'Unnamed Patient'
    : 'Patient'

  const tabs = [
    { id: 'patient', name: 'Patient Details' },
    { id: 'diagnoses', name: 'Diagnose Results' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
          <p className="text-gray-600 mt-1 text-sm">Patient ID: {id}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient')}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Patients
        </button>
      </div>

      {(patientsState.error || diagnosesState.error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {patientsState.error || diagnosesState.error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'patient' && (
            <div className="bg-transparent">
              {patientsState.status === 'loading' && !patient ? (
                <p className="text-gray-500 text-sm">Loading patient details...</p>
              ) : (
                <PatientInfoTab patient={patient} />
              )}
            </div>
          )}

          {activeTab === 'diagnoses' && (
            <div>
              {diagnosesState.status === 'loading' && diagnosesState.items.length === 0 && (
                <p className="text-gray-500 text-sm">Loading diagnosis results...</p>
              )}

              {diagnosesState.status === 'succeeded' && patientDiagnoses.length === 0 && (
                <p className="text-gray-500 text-sm">No diagnosis results found for this patient.</p>
              )}

              {patientDiagnoses.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left font-semibold px-4 py-3">Image</th>
                        <th className="text-left font-semibold px-4 py-3">Disease</th>
                        <th className="text-left font-semibold px-4 py-3">Diagnosis</th>
                        <th className="text-left font-semibold px-4 py-3">Eye</th>
                        <th className="text-left font-semibold px-4 py-3">Date</th>
                        <th className="text-left font-semibold px-4 py-3">Status</th>
                        <th className="text-left font-semibold px-4 py-3">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {patientDiagnoses.map((d) => (
                        <tr key={d._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <a
                              href={d.imageUrl || undefined}
                              target="_blank"
                              rel="noreferrer"
                              className={!d.imageUrl ? 'pointer-events-none' : ''}
                              title={d.imageUrl ? 'Open image' : 'No image'}
                            >
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                  src={d.imageUrl || 'https://via.placeholder.com/64x64?text=Scan'}
                                  alt="Eye scan"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Scan'
                                  }}
                                />
                              </div>
                            </a>
                          </td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{d.disease || '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{d.diagnosis || '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{d.eye || '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(d.createdAt)}</td>
                          <td className="px-4 py-3 text-gray-700">{d.status || '—'}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {d.confidence != null ? `${d.confidence}%` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDetails

