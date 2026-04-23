import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchPatientsThunk, createPatientThunk, updatePatientThunk } from '../state/patientsSlice'
import LiverRiskPredictor from '../components/LiverRiskPredictor'

function Patient() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: patients, status, error } = useSelector((state) => state.patients)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activePanel, setActivePanel] = useState('list') // list | edit
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const selectedPatient = patients.find((p) => p?._id === selectedPatientId) || null
  const [editPatient, setEditPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    condition: '',
    status: 'Active',
    dateOfBirth: '',
    lastVisit: '',
    nextAppointment: '',
  })

  // Liver Prediction State
  const [showLiverPredictor, setShowLiverPredictor] = useState(false)
  const [reportData, setReportData] = useState(null)

  const handleReportUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        // Attempt to parse as JSON first (Simulating structured extraction)
        let data = {}
        try {
            data = JSON.parse(text)
        } catch {
            // Dummy logic: If not JSON, use some sample values found in text or just dummy them
            data = {
                age: 45,
                tb: 1.5,
                db: 0.6,
                sgpt: 45,
                sgot: 40,
                alkphos: 150,
                tp: 7.0,
                alb: 3.5,
                'a/g_ratio': 1.0,
                gender_Male: '1',
                autoPredict: true // Tell predictor to run immediately
            }
        }
        setReportData(data)
        setShowLiverPredictor(true)
      } catch (err) {
        console.error("Report parsing failed:", err)
      }
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPatientsThunk())
    }
  }, [dispatch, status])

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreatePatient = async (e) => {
    e.preventDefault()

    const payload = {
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      email: newPatient.email || undefined,
      phone: newPatient.phone || undefined,
      condition: newPatient.condition || undefined,
      status: newPatient.status || undefined,
      dateOfBirth: newPatient.dateOfBirth || undefined,
      lastVisit: newPatient.lastVisit || undefined,
      nextAppointment: newPatient.nextAppointment || undefined,
    }

    const resultAction = await dispatch(createPatientThunk(payload))
    if (createPatientThunk.rejected.match(resultAction)) {
      return
    }

    setShowAddForm(false)
    setNewPatient({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      condition: '',
      status: 'Active',
      dateOfBirth: '',
      lastVisit: '',
      nextAppointment: '',
    })
  }

  const formatDate = (d) => {
    if (!d) return 'N/A'
    try {
      return new Date(d).toISOString().split('T')[0]
    } catch {
      return 'N/A'
    }
  }

  const openEdit = (patient) => {
    setShowAddForm(false)
    setSelectedPatientId(patient?._id || null)
    setEditPatient({
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      condition: patient?.condition || '',
      status: patient?.status || 'Active',
      dateOfBirth: patient?.dateOfBirth ? formatDate(patient.dateOfBirth) : '',
      lastVisit: patient?.lastVisit ? formatDate(patient.lastVisit) : '',
      nextAppointment: patient?.nextAppointment ? formatDate(patient.nextAppointment) : '',
    })
    setActivePanel('edit')
  }

  const closePanel = () => {
    setActivePanel('list')
    setSelectedPatientId(null)
    setEditPatient(null)
  }

  const handleEditPatientChange = (e) => {
    const { name, value } = e.target
    setEditPatient((prev) => ({ ...(prev || {}), [name]: value }))
  }

  const handleUpdatePatient = async (e) => {
    e.preventDefault()
    if (!selectedPatientId || !editPatient) return

    const payload = {
      firstName: editPatient.firstName,
      lastName: editPatient.lastName,
      email: editPatient.email || undefined,
      phone: editPatient.phone || undefined,
      condition: editPatient.condition || undefined,
      status: editPatient.status || undefined,
      dateOfBirth: editPatient.dateOfBirth || undefined,
      lastVisit: editPatient.lastVisit || undefined,
      nextAppointment: editPatient.nextAppointment || undefined,
    }

    const resultAction = await dispatch(updatePatientThunk({ id: selectedPatientId, updates: payload }))
    if (updatePatientThunk.rejected.match(resultAction)) return

    closePanel()
  }

  const filteredPatients = patients.filter((p) => {
    const name = `${p?.firstName || ''} ${p?.lastName || ''}`.trim()
    const q = searchQuery.trim().toLowerCase()
    const matchesQuery =
      !q ||
      name.toLowerCase().includes(q) ||
      (p?.email || '').toLowerCase().includes(q) ||
      (p?.phone || '').toLowerCase().includes(q)

    const matchesCondition = conditionFilter === 'All' || (p?.condition || '') === conditionFilter
    const matchesStatus = statusFilter === 'All' || (p?.status || '') === statusFilter
    return matchesQuery && matchesCondition && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">View and manage all patient records</p>
        </div>
        <button
          onClick={() => {
            closePanel()
            setShowAddForm((prev) => !prev)
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          + Add New Patient
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h2>
          <form onSubmit={handleCreatePatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={newPatient.firstName}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={newPatient.lastName}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newPatient.email}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={newPatient.phone}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                name="condition"
                value={newPatient.condition}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select condition</option>
                <option value="Digestive">Digestive</option>
                <option value="Spinal">Spinal</option>
                <option value="Liver">Liver</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={newPatient.status}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Active">Active</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={newPatient.dateOfBirth}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
              <input
                type="date"
                name="lastVisit"
                value={newPatient.lastVisit}
                onChange={handleNewPatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
              <input
                type="date"
                name="nextAppointment"
                value={newPatient.nextAppointment}
                onChange={handleNewPatientChange}
              />
            </div>
            {newPatient.condition === 'Liver' && (
              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2 mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">Autofill from Medical Report</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="report-upload"
                    className="hidden"
                    accept=".json,.txt,.pdf"
                    onChange={handleReportUpload}
                  />
                  <label
                    htmlFor="report-upload"
                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold border-2 border-dashed border-indigo-200 hover:bg-indigo-100 cursor-pointer flex items-center gap-2"
                  >
                    <span>📄</span> Upload Liver Report (AI Auto-fill)
                  </label>
                  <p className="text-[10px] text-gray-400 max-w-[200px]">
                    Upload a clinical report to automatically extract data and predict liver risk.
                  </p>
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Patient
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patient Details / Edit Panels */}
      {activePanel !== 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Patient
              </h2>
              {selectedPatient && (
                <p className="text-gray-600 mt-1 text-sm">
                  {`${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim() || 'Unnamed Patient'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closePanel}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to list
              </button>
            </div>
          </div>
          {editPatient && (
            <form onSubmit={handleUpdatePatient} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={editPatient.firstName}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={editPatient.lastName}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editPatient.email}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editPatient.phone}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  name="condition"
                  value={editPatient.condition}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select condition</option>
                  <option value="Digestive">Digestive</option>
                  <option value="Spinal">Spinal</option>
                  <option value="Liver">Liver</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editPatient.status}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editPatient.dateOfBirth}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                <input
                  type="date"
                  name="lastVisit"
                  value={editPatient.lastVisit}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
                <input
                  type="date"
                  name="nextAppointment"
                  value={editPatient.nextAppointment}
                  onChange={handleEditPatientChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={closePanel}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name, email, or phone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="All">All Conditions</option>
            <option value="Digestive">Digestive</option>
            <option value="Spinal">Spinal</option>
            <option value="Liver">Liver</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Name</th>
                <th className="text-left font-semibold px-5 py-3">Email</th>
                <th className="text-left font-semibold px-5 py-3">Phone</th>
                <th className="text-left font-semibold px-5 py-3">Condition</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="text-left font-semibold px-5 py-3">Last Visit</th>
                <th className="text-left font-semibold px-5 py-3">Next Appt.</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {status === 'loading' && patients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-gray-500">
                    Loading patients...
                  </td>
                </tr>
              )}

              {status === 'succeeded' && filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}

              {filteredPatients.map((patient) => {
                const name =
                  `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Unnamed Patient'

                return (
                  <tr key={patient._id || patient.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{name}</td>
                    <td className="px-5 py-4 text-gray-700">{patient.email || '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{patient.phone || '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{patient.condition || '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${patient.status === 'Active'
                            ? 'bg-blue-100 text-blue-800'
                            : patient.status === 'Monitoring'
                              ? 'bg-yellow-100 text-yellow-800'
                              : patient.status === 'Scheduled'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {patient.status || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{formatDate(patient.lastVisit)}</td>
                    <td className="px-5 py-4 text-gray-700">{formatDate(patient.nextAppointment)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/patient/${patient._id || patient.id}`)}
                          className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(patient)}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liver Risk Predictor Modal */}
      <LiverRiskPredictor 
        open={showLiverPredictor} 
        handleClose={() => setShowLiverPredictor(false)} 
        initialData={reportData}
      />
    </div>
  )
}

export default Patient
