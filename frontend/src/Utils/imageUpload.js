import { upload } from "@imagekit/javascript";
import axios from "axios";

export const uploadImage = async (file) => {
  // Get auth params (CORRECT API)
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/imagekit/auth`,
    {
      withCredentials: true, 
    },
  );

  // Convert file → base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const base64 = await toBase64(file);

  // Upload to ImageKit
  const result = await upload({
    file: base64,
    fileName: `${Date.now()}_${file.name}`,
    folder: `Products`,
    signature: data.signature,
    expire: data.expire,
    token: data.token,
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  });

  return result.url;
};
