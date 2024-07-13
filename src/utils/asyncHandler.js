
const asyncHandler = (requestHandler) =>{
    return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>{next(error)});

    }
}

export { asyncHandler };



// const a1=()={}
// const a2=(fun)={()=>{}}
// const a2=(fun)=async ()=>{}

// const asyncHandler = (fun) => async (req, res, next) => {
//     try {
//         await fun(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//              message: error.message || 'Something went wrong' 
//             });   
    
//         next(error);
//     }
// }