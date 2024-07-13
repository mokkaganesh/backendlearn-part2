import {v2 as cloudinary} from "cloudinary";
import fs from "fs";  //node wala filesyatem
//file read remove dir append



    // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});
    

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        //file has beeb uploaded to cloudinary
        console.log("file is uploaded to cloudinary ",response.url);
        return response;

    } catch (error) {
        //unlink file from local storage
        fs.unlinkSync(localFilePath);
        console.log("Error in uploading file to cloudinary",error);
        return null;

    }
};


export {uploadOnCloudinary};