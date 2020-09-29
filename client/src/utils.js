import axios from 'axios';

export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    buffer.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

export const getBase64 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const buffer = res.data;
        const base64Flag = "data:image.jpeg;base64,";
        const imageStr = arrayBufferToBase64(buffer.data.data);

        return base64Flag + imageStr;
    } catch(err) {
        return err;
    }
}