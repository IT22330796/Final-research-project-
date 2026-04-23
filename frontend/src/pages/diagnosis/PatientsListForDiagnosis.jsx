import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatientsThunk } from '../../state/patientsSlice'

const diseaseConfig = {
  digestive: {
    name: 'Digestive',
    accent: 'from-amber-500/10 to-orange-500/5',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  spinal: {
    name: 'Spinal',
    accent: 'from-slate-500/10 to-blue-500/5',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
  },
  liver: {
    name: 'Liver',
    accent: 'from-emerald-500/10 to-teal-500/5',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  'health-check': {
    name: 'Health Check',
    accent: 'from-green-500/10 to-emerald-500/5',
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
}

const statusStyles = {
  Active: 'bg-green-100 text-green-800 border-green-200',
  Monitoring: 'bg-blue-100 text-blue-800 border-blue-200',
  Scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
}

function getInitials(patient) {
  const first = patient.firstName?.charAt(0) || ''
  const last = patient.lastName?.charAt(0) || ''
  if (first || last) return (first + last).toUpperCase()
  return patient.email?.charAt(0)?.toUpperCase() || '?'
}

function getStatusStyle(status) {
  return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function PatientsListForDiagnosis() {
  const navigate = useNavigate()
  const { disease } = useParams()
  const dispatch = useDispatch()
  const { items: patients, status, error } = useSelector((state) => state.patients)
  const [searchQuery, setSearchQuery] = useState('')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPatientsThunk())
    }
  }, [dispatch, status])

  const config = diseaseConfig[disease] || {
    name: disease || 'Diagnosis',
    icon: '📋',
    accent: 'from-indigo-500/10 to-purple-500/5',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
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

  const handleDiagnose = (patient) => {
    navigate(`/diagnose/${disease}/upload`, { state: { patient } })
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.accent} border border-gray-200/80 p-6`}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {config.name} Diagnosis
            </h1>
            <p className="mt-1 text-gray-600">
              Select a patient below to run {config.name} analysis
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.badge}`}
              >
                {patients.length} patient{patients.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5">
        {error && (
          <div className="mx-6 mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search & Filters */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients by name, email, or phone..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none"
              >
                <option value="All">All Conditions</option>
                <option value="Digestive">Digestive</option>
                <option value="Spinal">Spinal</option>
                <option value="Liver">Liver</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Contact
                </th>
                <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:table-cell">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {status === 'loading' && patients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <p className="text-sm font-medium text-gray-500">
                        Loading patients...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {status === 'succeeded' && patients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        👤
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        No patients found
                      </p>
                      <p className="max-w-sm text-xs text-gray-500">
                        Add patients from the Patient Management page to run diagnosis
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredPatients.map((patient, idx) => {
                const fullName =
                  [patient.firstName, patient.lastName].filter(Boolean).join(' ') || '—'
                const initials = getInitials(patient)
                return (
                  <tr
                    key={patient._id || patient.id}
                    className={`group transition-colors hover:bg-indigo-50/50 ${
                      idx % 2 === 1 ? 'bg-gray-50/30' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{fullName}</p>
                          {patient.dateOfBirth && (
                            <p className="text-xs text-gray-500">
                              DOB:{' '}
                              {!isNaN(new Date(patient.dateOfBirth).getTime())
                                ? new Date(patient.dateOfBirth).toLocaleDateString()
                                : patient.dateOfBirth}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-0.5">
                        {patient.email && (
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <svg
                              className="h-3.5 w-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {patient.email}
                          </p>
                        )}
                        {patient.phone && (
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="h-3.5 w-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {patient.phone}
                          </p>
                        )}
                        {!patient.email && !patient.phone && (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-6 py-4 sm:table-cell">
                      {patient.condition ? (
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${config.badge}`}
                        >
                          {patient.condition}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          patient.status
                        )}`}
                      >
                        {patient.status || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => handleDiagnose(patient)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-md active:scale-[0.98]"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        Diagnose
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PatientsListForDiagnosis
