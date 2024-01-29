const _ = require('lodash');
const fs = require('fs/promises');

const getJSONParsedData = async () => {
    const studentJSON = await fs.readFile("./assets/db.json", "utf-8");
    return JSON.parse(studentJSON);
}
const writeDataToJSON = async (jsonData) => {
    await fs.writeFile("./assets/db.json", JSON.stringify(jsonData));
};

const getStudentsData = async (dataObject) => {
    const { name } = dataObject;
    
    let studentData = await getJSONParsedData();
    let students = studentData.students

    if (!_.isEmpty(name)) {
        students = _.filter(students, (item) => item.name.toLowerCase() === name.toLowerCase());
    }
    return Promise.resolve(students);
}
const addStudentData = async (dataObject) => {
    const formData = dataObject;

    let studentData = await getJSONParsedData();
    const latestIdNow = studentData.latestId + 1;
    const data = {
        id: latestIdNow,
        ...formData
    }
    studentData.students.push(data);
    studentData.latestId = latestIdNow;

    writeDataToJSON(studentData);

    return Promise.resolve();
}
const updateExistingData = async (dataObject) => {
    const { id, formData } = dataObject;

    let studentData = await getJSONParsedData();
    let index = studentData.students.findIndex(v => v.id === parseInt(id));
    if(id === -1) throw new Error("NOT_FOUND");

    studentData.students[index].name = formData.name;
    studentData.students[index].studentClass = formData.studentClass;
    studentData.students[index].grade = formData.grade;

    writeDataToJSON(studentData);

    return Promise.resolve();
}
const deleteStudentData = async (dataObject) => {
    const { id } = dataObject;

    let studentData = await getJSONParsedData();

    studentData.students = studentData.students.filter(v => v.id != parseInt(id));

    writeDataToJSON(studentData);

    return Promise.resolve();
}

module.exports = {
    getStudentsData,
    addStudentData,
    updateExistingData,
    deleteStudentData
}
