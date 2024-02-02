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
}
const __compareHashPassword = (inputedPassword, hashedPassword) => {
    return bcrypt.compareSync(inputedPassword, hashedPassword)
}
// TRAVELTICKET HELPERS FUNCTIONS
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
        const dateNow = new Date();
        const loginDate = dateNow.toISOString().slice(0, 19).replace('T', ' '); 
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

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

module.exports = {
    loginAuthentication,
    createNewAdmin,
    getAdminProfile
}