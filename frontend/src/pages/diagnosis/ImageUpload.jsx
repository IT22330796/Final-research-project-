import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { predictDigestive } from '../../api/digestiveApi'
import { predictLiver } from '../../api/liverApi'
import { predictSpinal } from '../../api/spinalApi'

function ImageUpload() {
  const navigate = useNavigate()
  const location = useLocation()
  const { disease } = useParams()
  const patient = location.state?.patient || null

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedEye, setSelectedEye] = useState('LEFT')

  const diseaseNames = {
    digestive: 'Digestive',
    spinal: 'Spinal',
    liver: 'Liver',
    'health-check': 'Health Check',
  }

  const diseaseName = diseaseNames[disease] || 'Medical Condition'

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please upload a valid image file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || isAnalyzing) return
    setIsAnalyzing(true)

    try {
      let apiResult = null;
      if (disease === 'digestive' || disease === 'health-check') {
        apiResult = await predictDigestive(selectedFile)
      } else if (disease === 'liver') {
        apiResult = await predictLiver(selectedFile)
      } else if (disease === 'spinal') {
        apiResult = await predictSpinal(selectedFile)
      }

      navigate(`/diagnose/${disease}/upload/results`, {
        state: {
          image: preview,
          fileName: selectedFile.name,
          aiResult: apiResult,
          patient,
          eye: selectedEye,
          file: selectedFile,
        },
      })
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Analysis failed'
      alert(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Diagnose {diseaseName}</h1>
        </div>
        <p className="text-gray-600 mt-1">Upload a medical scan to analyze and diagnose potential conditions</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Medical Scan</h2>
          <p className="text-gray-600 mb-6">
            The AI will analyze your medical scan to detect signs of {diseaseName} conditions
          </p>

          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 transition-colors ${dragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
              }`}
          >
            {preview ? (
              <div className="space-y-4">
                {/* Left / Right Eye Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Eye
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="eye"
                        value="LEFT"
                        checked={selectedEye === 'LEFT'}
                        onChange={() => setSelectedEye('LEFT')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Left Eye
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="eye"
                        value="RIGHT"
                        checked={selectedEye === 'RIGHT'}
                        onChange={() => setSelectedEye('RIGHT')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Right Eye
                      </span>
                    </label>
                  </div>
                </div>

                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-md mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-indigo-600">Analyzing...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we process your image</p>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview(null)
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      onClick={handleUpload}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Analyze Image
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop your medical scan image here
                </p>
                <p className="text-gray-500 mb-6">or</p>
                <label className="cursor-pointer">
                  <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                    browse files
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          {/* File Naming Convention */}
          <div className="mt-8 text-left max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">File naming convention:</h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <p className="text-gray-700">patientId_scanType_randomtext.jpg</p>
              <p className="text-gray-500 mt-1">Example: P1_CT_scan145.jpg</p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Supported formats: JPEG, PNG | Max size: 10MB | 1 file only</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        By uploading an image, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

export default ImageUpload

