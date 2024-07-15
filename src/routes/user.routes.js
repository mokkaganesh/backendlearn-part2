import {Router} from 'express';
import { logoutUser, registerUser ,loginUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser);

router.route('/login').post(loginUser);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/change-password').post(verifyJWT,changeCurrentPassword);
router.route('/current-user').get(verifyJWT,getCurrentUser);
router.route('/update-profile').patch(verifyJWT,updateAccountDetails);
router.route('/update-avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar);

// updateUserAvatar
router.route('/update-cover-image').patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage);
//getUserChannelProfile
router.route('/getUserChannelProfile/:username').get(verifyJWT,getUserChannelProfile);

router.route('/history').get(verifyJWT,getWatchHistory);


export default router;