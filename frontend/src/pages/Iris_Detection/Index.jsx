import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"
import Lottie from "lottie-react";
import irisAnimation from "../../assets/Visibility.json";
import Validation from "../../assets/Businessman flies up with rocket.json";

function IrisDetection() {
    const navigate = useNavigate()
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [scanning, setScanning] = useState(false)


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

    const handleUpload = () => {
        setTimeout(() => {
            navigate(`/iris/result`, {
                state: { image: preview, fileName: selectedFile.name },
            })
        }, 2500)
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
                    <h1 className="text-3xl font-bold text-gray-900">Iris Image Validation</h1>
                </div>
                <p className="text-gray-600 mt-1">Analyzing uploaded scan for quality and validity</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2"> </h2>
                    <p className="text-gray-600 mb-6">

                    </p>
                    <motion.div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className={`border-2 border-dashed rounded-xl p-2 transition-colors ${dragActive
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:border-indigo-400'
                            }`}
                    >
                        {preview ? (
                            <div className="space-y-4">
                                <motion.div
                                    animate={{ scale: [0.95, 1, 0.95] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex justify-center mb-1"
                                >
                                    <Lottie
                                        animationData={Validation}
                                        loop
                                        autoplay
                                        className="w-48 h-40"
                                    />
                                </motion.div>

                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="text-indigo-600 font-medium mb-4"
                                    style={{ fontSize: 28, color: '#2E8B57' }}
                                >
                                    Valid Iris Image Detection
                                </motion.div>
                                <p className="text-gray-600 mt-1">The uploaded image meets all quanity standards. ML model one proceeding to detailed health analysis.</p>
                               
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-md mx-auto rounded-lg shadow-md"
                                />
                                <p className="text-sm text-gray-600">{selectedFile?.name}</p>

                                 <div className="mt-6 flex flex-col items-center" style={{paddingTop:5}}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "50%" }}
                                        transition={{ duration: 2.5 }}
                                        className="h-2 bg-green-500 rounded-full"
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        AI analyzing iris patterns...
                                    </p>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null)
                                            setPreview(null)
                                        }}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Change
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                         Continue to health
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center mb-1">
                                    <motion.div
                                        animate={{ scale: [0.95, 1, 0.95] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="flex justify-center mb-1"
                                    >
                                        <Lottie
                                            animationData={irisAnimation}
                                            loop
                                            autoplay
                                            className="w-48 h-40"
                                        />
                                    </motion.div>

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
                    </motion.div>


                    {/* Supported Formats */}
                    <div className="mt-6 text-sm text-gray-500">
                        <p>Supported formats: JPEG, PNG | Max size: 10MB | 1 file only</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IrisDetection

