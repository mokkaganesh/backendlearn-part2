import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/APIRespose.js';

const registerUser = asyncHandler(async (req, res) => {
    
    //get user details from user
    //validation - not empty
    //check if user already exists  : username or email
    //check for images - avatar 
    //upload images to cloudinary
    //create user object  - create entry in db
    //remove password and refreshtoken field from response
    //check for user creation -> return response
    // res.status(200).json({ success: true, message: "ok" });


    console.log(req.body);
    const {fullname, username, email, password } = req.body;
    console.log(username,"  ",email);

    if(!username && !email && !password){
        throw new ApiError(400, "enter required fields");
    }

    const existedUser  = User.findOne({$or: [{username: username}, {email: email}]})
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    //req.files from multer(middileware gives some fileds extra -> {kyon we add middleware in between  user.routes.js}) like req.body from express
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath ){
        throw new ApiError(400, "avatar image is required");
    }
    
    //upload images to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Error in uploading images");
    }


    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",

    });

   const usercreated =  await User.findById(user._id).select(
            "-password -refreshToken"
    );

    if(!usercreated){
        throw new ApiError(500, "Something went wrong while in creating user");
    }

    // return new ApiResponse(201, "User created successfully", usercreated);
    return res.status(201).json(new ApiResponse(200, "User created successfully", usercreated));
});

export { registerUser };
