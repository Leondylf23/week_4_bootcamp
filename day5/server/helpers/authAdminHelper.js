const _ = require('lodash');
const Boom = require('boom');
const bcrypt = require('bcrypt');
const db = require('../../models');
const jwt = require('jsonwebtoken');

const GeneralHelper = require('./generalHelper');

const passwordSaltRound = bcrypt.genSaltSync(12);
const signatureSecretKey = process.env.SIGN_SECRET_KEY || 'pgJApn9pJ8';
const sessionAge = process.env.SESSION_AGE || '12h'

// PRIVATE FUNCTIONS
const __generateHashPassword = (password) => {
    return bcrypt.hashSync(password, passwordSaltRound);
};

const __compareHashPassword = (inputedPassword, hashedPassword) => {
    return bcrypt.compareSync(inputedPassword, hashedPassword)
};

const __generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
  
    return result;
};

// AUTH ADMIN HELPERS FUNCTIONS
const loginAuthentication = async (dataObject) => {
    const { email, password } = dataObject;

    try {
        const data = await db.admin.findOne({
            where: { email }
        });

        if(_.isEmpty(data)) throw Boom.notFound('Account not found from this email!');

        const hashedPassword = data?.dataValues?.password;
        const isValid = __compareHashPassword(password, hashedPassword);

        if(!isValid) throw Boom.unauthorized('Wrong email or password!');

        const fullname = data?.dataValues?.fullname;
        const userId = data?.dataValues?.id;
        const constructData = { userId, fullname };

        const token = jwt.sign(constructData, signatureSecretKey, { expiresIn: sessionAge });

        return Promise.resolve({
            token,
            userData: {
                fullname
            }
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const createNewAdmin = async (dataObject) => {
    const { fullname, dob, email, password } = dataObject;

    try {
        const checkData = await db.admin.findOne({
            where: { email }
        });

        if(!_.isEmpty(checkData)) throw Boom.badData('Email already used!');

        const hashedPassword = __generateHashPassword(password);

        const createdAdmin = await db.admin.create({ fullname, dob, email, password: hashedPassword });
        if(_.isEmpty(createdAdmin)) throw Boom.internal('Admin not created!');

        return Promise.resolve({
            message: 'Register success, please login with new credentials!'
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAdminProfile = async (adminId) => {
    try {
        const data = await db.admin.findByPk(adminId);

        if(_.isEmpty(data)) throw Boom.badData('Profile data not found, maybe bad session data!');
        
        const dataValue = data?.dataValues;
        const filteredData = {...dataValue, password: undefined}

        return Promise.resolve(filteredData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const changePassword = async (dataObject, adminId) => {
    const { oldPassword, newPassword } = dataObject;

    try {
        const data = await db.admin.findByPk(adminId);

        if(_.isEmpty(data)) throw Boom.badData('Profile data not found, maybe bad session data!');

        const hashedOldPassword = data?.dataValues?.password;
        const isValid = __compareHashPassword(oldPassword, hashedOldPassword);

        if(!isValid) throw Boom.unauthorized('Wrong old password!');

        const hashedNewPassword = __generateHashPassword(newPassword);
        const checkUpdate = await data.update({ password: hashedNewPassword });
        if(_.isEmpty(checkUpdate)) throw Boom.internal('Password not updated!');

        return Promise.resolve({message: 'Password updated! Next time login use new password...'});
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const resetPassword = async (dataObject) => {
    const { email } = dataObject;

    try {
        const data = await db.admin.findOne({ where: {email} });

        if(_.isEmpty(data)) throw Boom.badData('Unknown email!');

        const randomString = __generateRandomString(14);
        const hashedNewPassword = __generateHashPassword(randomString);
        const checkUpdate = await data.update({ password: hashedNewPassword });
        if(_.isEmpty(checkUpdate)) throw Boom.internal('Password not reset!');

        return Promise.resolve({
            message: 'Password has been reset, please use new password!',
            newPassword: randomString
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const updateProfile = async (dataObject, adminId) => {
    const { fullname, dob } = dataObject;

    try {
        const data = await db.admin.findByPk(adminId);

        if(_.isEmpty(data)) throw Boom.badData('Profile data not found, maybe bad session data!');

        const checkUpdate = await data.update({ fullname, dob });
        if(_.isEmpty(checkUpdate)) throw Boom.internal('Profile not updated!');

        return Promise.resolve({message: 'Profile updated!'});
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

module.exports = {
    loginAuthentication,
    createNewAdmin,
    getAdminProfile,
    changePassword,
    resetPassword,
    updateProfile
}