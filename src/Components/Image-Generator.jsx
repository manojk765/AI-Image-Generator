import React, { useRef, useState } from 'react';
import './image.css';
import bg_img from '../Components/bgimage.jpg';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const token = "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";

function ImageGenerator() {
    const [image_url, setImage_url] = useState(bg_img);
    const [loading, setLoading] = useState(false); 
    let inputref = useRef(null);

    async function query() {
        if (inputref.current.value === "") {
            return null;
        }

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ "inputs": inputref.current.value }),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.blob();
            return result;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    }

    const generateImage = async () => {
        setLoading(true);  
        const response = await query();
        if (response) {
            const ObjectURL = URL.createObjectURL(response);
            setImage_url(ObjectURL);
        }
        setLoading(false);  
    };

    return (
        <div className='ai-image'>
            <div className='header'>
                <h1><span>AI Image</span> Generator</h1>
                <p>Where your imagination takes a pictorial form</p>
            </div>
            <div className='image-loading'>
                {loading ? (
                    <p>Loading image...</p> 
                ) : (
                    <img src={image_url} alt="Generated" />
                )}
            </div>

            <div className='search-box'>
                <input
                    type='text'
                    className='search-input'
                    ref={inputref}
                    placeholder='Describe the image you want to see'
                />
                <div
                    className='generate-btn'
                    style={{ fontSize: '40px' }}
                    onClick={generateImage}
                >
                    <FaRegArrowAltCircleUp />
                </div>
            </div>
        </div>
    );
}

export default ImageGenerator;
