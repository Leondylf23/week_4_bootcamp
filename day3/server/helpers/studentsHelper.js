const _ = require('lodash');
const fs = require('fs/promises');
const Boom = require('boom');

const _getJSONParsedData = async () => {
    const studentJSON = await fs.readFile("./assets/db.json", "utf-8");
    return JSON.parse(studentJSON);
};

const _writeDataToJSON = async (jsonData) => {
    await fs.writeFile("./assets/db.json", JSON.stringify(jsonData));
};

const getStudentsData = async (dataObject) => {
    const { name } = dataObject;
    
    let studentData = await _getJSONParsedData();
    let students = studentData.students

    if (!_.isEmpty(name)) {
        students = _.filter(students, (item) => item.name.toLowerCase() === name.toLowerCase());
    }
    return Promise.resolve(students);
};

const addStudentData = async (dataObject) => {
    const formData = dataObject;

    let studentData = await _getJSONParsedData();
    const latestIdNow = studentData.latestId + 1;
    const data = {
        id: latestIdNow,
        ...formData
    }
    studentData.students.push(data);
    studentData.latestId = latestIdNow;

    _writeDataToJSON(studentData);

    return Promise.resolve(latestIdNow);
};

const updateExistingData = async (dataObject) => {
    const { id, formData } = dataObject;

    let studentData = await _getJSONParsedData();
    let index = studentData.students.findIndex(v => v.id === parseInt(id));

    if(index === -1) throw Boom.notFound("Student not found!");

    studentData.students[index].name = formData.name;
    studentData.students[index].studentClass = formData.studentClass;
    studentData.students[index].grade = formData.grade;

    _writeDataToJSON(studentData);

    return Promise.resolve();
};

const deleteStudentData = async (dataObject) => {
    const { id } = dataObject;

    let studentData = await _getJSONParsedData();
    let index = studentData.students.findIndex(v => v.id === parseInt(id));

    if(index === -1) throw Boom.notFound("Student not found!");
    studentData.students = studentData.students.filter(v => v.id != parseInt(id));

    _writeDataToJSON(studentData);

    return Promise.resolve();
};

module.exports = {
    getStudentsData,
    addStudentData,
    updateExistingData,
    deleteStudentData
}
