import { useNavigate } from 'react-router-dom'

const usePreviousPage = () => {
    const navigate = useNavigate()

    const back = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1)
        } else {
            navigate('/', { replace: true })
        }
    }

    return { back }
}

export default usePreviousPage
