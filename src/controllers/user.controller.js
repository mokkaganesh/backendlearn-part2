import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/APIRespose.js';

const generateAccessAndRefreshTokens = async (userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken =  user.generateToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false});
        return {accessToken,refreshToken};
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating access token and refresh token")
    }
}



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
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath ){
        throw new ApiError(400, "avatar image is required");
    }
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
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

const loginUser = asyncHandler( async (req,res) =>{
    //enter email or username
    //find the user -> present or not
    //enter password check
    //access and refresh token 
    //send cookie
    const {email , username , password} =req.body;

    if(!username || !email){
        throw new ApiError(400,"username or email  required")
    }

    const user= await User.findOne({$or:[{email},{username}]})
    if(!user){
        throw new ApiError(404,"user does not exist");
    }

    const isPasswordVaild = await user.checkPassword(password);
    if(!isPasswordVaild){
        throw new ApiError(401,"password incorrect");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")
    
    //by default anyone can modify -> make it true
    const options = {
        httpOnly:true ,//server se modify karna
        secure :true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(
        200,
        {
            user :loggedInUser, accessToken,refreshToken
        },"user logged In Successfully"
    ));
});

const logoutUser = asyncHandler(async (req,res)=>{
    //remove the cookies first
    

    // to logout i dont have any email 
    //one idea -> put form to add email 
    //-> this is not good practice -> any user can be loggedout by other person

    //cookiepaser

    const userId = req.user._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $set:{refreshToken: undefined}
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly:true ,//server se modify karna
        secure :true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"));

});


export { registerUser , 
    loginUser ,
    logoutUser
};
