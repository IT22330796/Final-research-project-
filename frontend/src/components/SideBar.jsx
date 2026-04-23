import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Sidebar({ sidebarOpen }) {
  const location = useLocation()
  const [diagnosisOpen, setDiagnosisOpen] = useState(true)

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Diagnose',
      path: '/diagnosis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      submenu: [
        {
          name: 'Digestive',
          path: '/diagnose/digestive',
        },
        {
          name: 'Spinal',
          path: '/diagnose/spinal',
        },
        {
          name: 'Liver',
          path: '/diagnose/liver',
        },
        {
          name: 'Health Check',
          path: '/diagnose/health-check',
        },
      ],
    },
    {
      name: 'Patients',
      path: '/patient',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  const isActive = (path) => {
    if (path === '/diagnosis' || path === '/diagnose') {
      return location.pathname.startsWith('/diagnose') || location.pathname.startsWith('/diagnosis')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }


  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-900 to-purple-900 transition-all duration-300 z-30 ${
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <nav className="h-full overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setDiagnosisOpen(!diagnosisOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={isActive(item.path) ? 'text-white' : 'text-indigo-300'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${diagnosisOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {diagnosisOpen && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        const isSubActive = location.pathname.startsWith(subItem.path)
                        return (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 rounded-lg transition-colors ${
                                isSubActive
                                  ? 'bg-indigo-800 text-white font-medium'
                                  : 'text-indigo-200 hover:bg-indigo-800/50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800/50'
                  }`}
                >
                  <span className={isActive(item.path) ? 'text-white' : 'text-indigo-300'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

