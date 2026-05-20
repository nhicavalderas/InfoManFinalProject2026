import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { reportsApi } from '../services/api'
import { Users, TrendingUp, BarChart2 } from 'lucide-react'

export default function ReportsPage() {
  const [headcount, setHeadcount] = useState([])
  const [salary, setSalary] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('headcount')

  useEffect(() => { loadReports() }, [])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [h, s] = await Promise.all([
        reportsApi.getHeadcountByDept(),
        reportsApi.getSalarySummaryByJob()
      ])
      setHeadcount(h || [])
      setSalary(s || [])
    } catch (err) {
      setError('Failed to load reports: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const maxHeadcount = Math.max(...headcount.map(h => h.activeheadcount || 0), 1)
  const maxSalary = Math.max(...salary.map(s => s.maxsalary || 0), 1)

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading reports..." /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">HR Reports</h1>
        <p className="text-gray-500">Headcount by department and salary summary by job</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadReports} className="underline ml-2">Retry</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'headcount', label: 'Headcount by Department', icon: Users },
          { id: 'salary', label: 'Salary Summary by Job', icon: TrendingUp },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Headcount Tab */}
      {activeTab === 'headcount' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Active Headcount by Department</h2>
              <p className="text-sm text-gray-500">Number of active employees per department</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {headcount.map(row => (
              <div key={row.deptcode}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{row.deptname} <span className="text-gray-400 text-xs">({row.deptcode})</span></span>
                  <span className="font-bold text-indigo-600">{row.activeheadcount} employees</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(row.activeheadcount / maxHeadcount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <p className="text-sm text-gray-600">
              Total active employees: <span className="font-bold text-gray-900">
                {headcount.reduce((sum, r) => sum + (r.activeheadcount || 0), 0)}
              </span> across <span className="font-bold text-gray-900">{headcount.length}</span> departments
            </p>
          </div>
        </div>
      )}

      {/* Salary Tab */}
      {activeTab === 'salary' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Salary Summary by Job</h2>
              <p className="text-sm text-gray-500">Min, max, and average salary per job position</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Job Code</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Assignments</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Min Salary</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Max Salary</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Avg Salary</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Range</th>
                </tr>
              </thead>
              <tbody>
                {salary.map((row, i) => (
                  <tr key={row.jobcode} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 font-mono text-xs text-indigo-600 font-semibold">{row.jobcode}</td>
                    <td className="px-6 py-3 text-gray-700">{row.jobdesc}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{row.assignments}</td>
                    <td className="px-6 py-3 text-right text-gray-600">₱{Number(row.minsalary).toLocaleString()}</td>
                    <td className="px-6 py-3 text-right text-gray-600">₱{Number(row.maxsalary).toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">₱{Number(row.avgsalary).toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(row.maxsalary / maxSalary) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}