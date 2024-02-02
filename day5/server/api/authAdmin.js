const Router = require('express').Router();

const ValidationAuthAdmin = require('../helpers/validationAuthAdmin');
const AuthAdminHelper = require('../helpers/authAdminHelper');
const GeneralHelper = require('../helpers/generalHelper');
const AuthMiddleware = require('../middlewares/authMiddleware');

const fileName = 'server/api/authAdmin.js';

const getAdminProfileData = async (request, reply) => {
    try {
        const userData = GeneralHelper.getUserData(request);
        const response = await AuthAdminHelper.getAdminProfile(userData.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Get Admin Profile API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}

const login = async (request, reply) => {
    try {
        ValidationAuthAdmin.loginFormValidation(request.body);

        const formData = request.body;
        const response = await AuthAdminHelper.loginAuthentication(formData);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Login API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const register = async (request, reply) => {
    try {
        ValidationAuthAdmin.registerFormValidation(request.body);

        const formData = request.body;
        const response = await AuthAdminHelper.createNewAdmin(formData);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Register API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const changePassword = async (request, reply) => {
    try {
        ValidationAuthAdmin.changePasswordFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await AuthAdminHelper.changePassword(formData, userData.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Change Password API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const resetPassword = async (request, reply) => {
    try {
        ValidationAuthAdmin.resetPasswordFormValidation(request.body);

        const formData = request.body;
        const response = await AuthAdminHelper.resetPassword(formData);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Reset Password API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const updateProfile = async (request, reply) => {
    try {
        ValidationAuthAdmin.updateProfileFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await AuthAdminHelper.updateProfile(formData, userData.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Update Profile API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

Router.get('/profile', AuthMiddleware.validateToken, getAdminProfileData);

Router.post('/login', login);
Router.post('/register', register);
Router.post('/resetpassword', resetPassword);

Router.patch('/changepassword', AuthMiddleware.validateToken, changePassword);
Router.patch('/profile/update', AuthMiddleware.validateToken, updateProfile);

module.exports = Router;
