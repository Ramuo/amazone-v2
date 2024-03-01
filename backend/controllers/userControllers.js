import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import User  from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';


//@desc     Login user & and get the token (signin)
//@route    POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async(req, res) => {
   const {email, password} = req.body;

   //Let us find a user
   const user = await User.findOne({ email });

   // Let's validate user cedentials
   if(user && (await user.matchPassword(password))){
    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
   }else{
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
   }
});


//@desc     Register new user (signup)
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    // Find user by email
    const userExist = await User.findOne({ email });

    // Check if user exist alredy
    if(userExist){
        res.status(400);
        throw new Error("L'utilistaur existe déjà")
    };

    //To create new user it does'nt exist
    const user = await User.create({
        name,
        email,
        password
    });

    //Once user created, then set it into db
    if(user){
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }else{
        res.status(400);
        throw new Error("Information invalide")
    };

});


//@desc     Logout user / clear the cookie
//@route    POST /api/users/logout
//@access   Private
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
       httpOnly: true,
       expires: new Date(0)
    });

    res.status(200).json({message: "Déconnecté avec succès"});
});


//@desc     Get user profile
//@route    GET /api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    // check if  user
    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else{
        res.status(404);
        throw new Error("Utilisateur non trové");
    };
});

//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    //Check if user 
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        //Let's check if in the request sent, if there is a password
        if(req.body.password){
            user.password = req.body.password
        };

        //Save the updated changes
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    }else{
        res.status(404);
        throw new Error("Utilisateur non trové")
    };

});

//@desc     Get all users
//@route    GET /api/users
//@access   Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});

    res.status(200).json(users);
    
});

//@desc     Get user by ID
//@route    GET /api/users/:id
//@access   Private/Admin
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user)
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

//@desc     Delete users
//@route    DELETE /api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error("Vous ne pouver pas supprimé un utilisateur Admin ")
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: 'Utilisateur supprimé'})
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

//@desc     Update user 
//@route    PUT /api/users/:id
//@access   Private/admin
const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouveé');
    }
});



// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
const forgotPassword = asyncHandler(async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        res.status(404);
        throw new Error("There is no user with that email");
    };

    //Get reset token 
    const resetToken = user.getResetTokenPassword();
    console.log(resetToken); 

    await user.save({validateBeforeSave: false});

    //Create reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

                
    //Sending Email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({
            success: true,
            data: "Email sent"
        });
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error("Email could not be sent")
    };
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
const  resetPassword = asyncHandler(async(req, res) => {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    //Find the user by resettoken only if the expiration is greatter than right now
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} //Expiry is greatter than right now
    });

    if(!user){
        res.status(400);
        throw new Error("Invalid Token")
    };

    //If we find the user & the token is not expired, then set new Password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        email: user.email,
        password: user.password
    });
});



export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
}