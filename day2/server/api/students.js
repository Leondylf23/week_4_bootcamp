const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const StudentHelper = require('../helpers/studentsHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/students.js';

const list = async (request, reply) => {
    try {
        Validation.studentListValidation(request.query);

        const { name } = request.query;
        const response = await StudentHelper.getStudentsData({ name });

        return reply.send(response);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const add = async (request, reply) => {
    try {
        Validation.studentFormValidation(request.body);

        const formData = request.body;
        await StudentHelper.addStudentData(formData);

        return reply.send("Student added successfully");
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const update = async (request, reply) => {
    try {
        // Validation.stu
        Validation.studentFormValidation(request.body);
        const { id } = request.query;
        const formData = request.body;

        await StudentHelper.updateExistingData({ id, formData });

        return reply.send("Student updated successfully");
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const deleteData = async (request, reply) => {
    try {
        // Validation.pokemonListValidation(request.query);

        const { id } = request.query;
        await StudentHelper.deleteStudentData({ id });

        return reply.send("Student deleted successfully");
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}

Router.get('/list', list);
Router.post('/add', add);
Router.put('/addput', add);
Router.patch('/update', update);
Router.delete("/delete", deleteData);

module.exports = Router;
