import { useState } from 'react'

export const useHeaderImage = () => {
    const [headerImage, setHeaderImage] = useState({})

    const handleHeaderImage = (event) => {
        if (event.target.dataset) {
            const image = new Image()
            image.src = URL.createObjectURL(event.target.files[0])
            image.onload = () => {
                setHeaderImage({[event.target.dataset.name]: { file: event.target.files[0], dimensions: {width: image.naturalWidth, height: image.naturalHeight}, url: URL.createObjectURL(event.target.files[0]) }})
            }
        }
    }

    return { handleHeaderImage, headerImage }
}