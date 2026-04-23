import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteDiagnosisThunk, fetchDiagnosesThunk } from '../../../state/diagnosesSlice'
import ConfirmationModal from '../../../components/ConfirmationModal'

function PastDiagnosesTab() {
  const dispatch = useDispatch()
  const { items: pastDiagnoses, status, error } = useSelector((state) => state.diagnoses)
  const [expandedId, setExpandedId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiagnosesThunk())
    }
  }, [dispatch, status])

  const handleViewClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleDeleteClick = (id, e) => {
    e.stopPropagation()
    setConfirmDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    const id = confirmDeleteId
    if (!id) return
    const resultAction = await dispatch(deleteDiagnosisThunk(id))
    if (deleteDiagnosisThunk.rejected.match(resultAction)) return
    setConfirmDeleteId(null)
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900">Diagnosis History</h3>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IMAGE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DISEASE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DIAGNOSIS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">EYE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DATE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CONFIDENCE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {status === 'loading' && pastDiagnoses.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-500">
                      Loading diagnoses...
                    </td>
                  </tr>
                )}
                {status === 'succeeded' && pastDiagnoses.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-500">
                      No past diagnoses found.
                    </td>
                  </tr>
                )}
                {pastDiagnoses.map((diagnosis) => {
                  const imageSrc = diagnosis.imageUrl || 'https://via.placeholder.com/64x64?text=Scan'
                  const date = diagnosis.createdAt
                    ? new Date(diagnosis.createdAt).toLocaleDateString()
                    : ''
                  const recommendedTests = Array.isArray(diagnosis.recommendedTests)
                    ? diagnosis.recommendedTests
                    : []
                  return (
                  <>
                    <tr key={diagnosis._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={imageSrc}
                            alt="Eye scan"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=Eye+Scan'
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{diagnosis.disease}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{diagnosis.diagnosis}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg 
                            className="w-4 h-4 text-gray-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                            />
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                            />
                          </svg>
                          <span className="text-sm text-gray-700">{diagnosis.eye}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{date}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            diagnosis.status === 'Checked' ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {diagnosis.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {diagnosis.confidence != null ? `${diagnosis.confidence}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(diagnosis._id)}
                            className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(diagnosis._id, e)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === diagnosis._id && (
                      <tr className="bg-gray-50/60">
                        <td colSpan="8" className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Scan</p>
                                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                  <img
                                    src={imageSrc}
                                    alt="Eye scan"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/256x256?text=Eye+Scan'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Prescribed Medicine</p>
                                    <p className="text-sm text-gray-900 mt-1">{diagnosis.prescribedMedicine || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Recommended Tests</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                      {recommendedTests.length > 0 ? recommendedTests.join(', ') : '—'}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Clinical Notes</p>
                                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                                    {diagnosis.clinicalNotes || '—'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmationModal
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete diagnosis?"
        message="Are you sure you want to delete this diagnosis record? This action cannot be undone."
      />
    </>
  )
}

export default PastDiagnosesTab

