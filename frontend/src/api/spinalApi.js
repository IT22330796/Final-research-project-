import axios from 'axios'

const ML_API = axios.create({
    baseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5000',
})

export async function predictSpinal(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    const { data } = await ML_API.post('/spinal/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
}
