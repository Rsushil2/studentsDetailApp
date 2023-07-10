// get all students list
// const { connectToDb, getDb } = require('../db');
const { ObjectId } = require("mongodb");

module.exports.GetAllStudentsList = function (page, limit, db) {
  const startIndex = (page - 1) * limit;
  const endIndex = limit;
  const endPage = page * limit;

  let results = {};
  let students = [];
  let totalCount;

  const query = { id: { $gt: 0 } };
  const options = {
    // sort returned documents in ascending order by id
    sort: { id: 1 },
    // Include only the `id`,`first_name`,`last_name` and `email` fields in each returned document
    projection: { _id: 1, id: 1, first_name: 1, last_name: 1, email: 1 },
  };

  return db
    .collection("Students")
    .countDocuments()
    .then((count) => {
      totalCount = count;
      return db
        .collection("Students")
        .find(query, options) // cursor toArray forEach
        .skip(startIndex)
        .limit(endIndex)
        .forEach((student) => students.push(student))
        .then((_) => {
          results.students = students;
          results.error = null;
          if (startIndex > 0) {
            results.previousPage = page - 1;
          }

          if (endPage < totalCount) {
            results.nextPage = page + 1;
          }

          results.totalPage = Math.ceil(totalCount / endIndex);
          results.totalStudents = totalCount;
          return results;
        })
        .catch((err) => {
          console.error(err);
          results.error = err;
          return results;
        });
    });
};
//available ids
module.exports.filterId = function (db) {
    let results = {};
    let existedId = [];
    const totalIds = 100;
  
    // Create an array of all IDs from 1 to 100
    const allIds = Array.from({ length: totalIds }, (_, index) => index + 1);
  
    const query = { id: { $gt: 0 } };
    const options = {
      sort: { id: 1 },
      projection: { _id: 0, id: 1 },
    };
  
    return db
      .collection("Students")
      .find(query, options)
      .forEach((exist) => existedId.push(exist.id))
      .then((_) => {
        results.existedId = existedId;
        results.availableId = allIds.filter((item) => !existedId.includes(item));
        return results;
      })
      .catch((err) => {
        console.error(err);
        results.error = err;
        return results;
      });
  };
  

// get Student by id
module.exports.studentById = function (id, db) {
  return db
    .collection("Students")
    .findOne({ _id: id })
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      console.error(err);
      results.error = err;
      return results;
    });
};

// get student by name
module.exports.studentByName = function (firstName, db) {
  return db
    .collection("Students")
    .find({ first_name: { $regex: firstName, $options: "i" } })
    .toArray()
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      console.error(err);
      results.error = err;
      return results;
    });
};

// Create Document

module.exports.createDoc = function (doc, db) {
  if (!doc.first_name) {
      return {
        success: false,
        message: "First Name Must be filled!",
      };
  }

  if (!doc.last_name) {
      return {
        success: false,
        message: "Last Name Must be filled!",
      };
  }

  if (!doc.email) {
    return {
        success: false,
        message: "Email Must be filled!",
      };
  }

  if (!doc.id) {
    return {
        success: false,
        message: "Id Must be choosed!",
      };
  }

  const student = {
    id: parseInt(doc.id),
    first_name: doc.first_name,
    last_name: doc.last_name,
    email: doc.email,
    age: doc.age,
    phone_number: doc.phone_number,
    address: doc.address,
    city: doc.city,
    major: doc.major,
    gpa: doc.gpa,
    graduation_date: doc.graduation_date,
    gender: doc.gender,
  };
  return db
    .collection("Students")
    .insertOne(student)
    .then((doc) => {
      return {
        success: true,
        message: "Student Created Successfully",
        doc,
      };
    })
    .catch((err) => {
      console.error(err);
      results.error = err;
      return results;
    });
};

// Delete Document
module.exports.deleteDoc = function (id, db) {
  if (ObjectId.isValid(id)) {
    return db
      .collection("Students")
      .deleteOne({ _id: id })
      .then((doc) => {
        return {
          success: true,
          message: "Student deleted Successfully",
          doc,
        };
      })
      .catch((err) => {
        console.error(err);
        results.error = err;
        return results;
      });
  } else {
    return error;
  }
};

// Update Document
module.exports.updateDoc = function (id, doc, db) {
  const updates = {
    id: parseInt(doc.id),
    first_name: doc.first_name,
    last_name: doc.last_name,
    email: doc.email,
    age: doc.age,
    phone_number: doc.phone_number,
    address: doc.address,
    city: doc.city,
    major: doc.major,
    gpa: doc.gpa,
    graduation_date: doc.graduation_date,
    gender: doc.gender,
  };
  if (ObjectId.isValid(id)) {
    return db
      .collection("Students")
      .updateOne({ _id: id }, { $set: updates })
      .then((doc) => {
        return {
          success: true,
          message: "Student Updated Successfully",
          doc,
        };
      })
      .catch((err) => {
        console.error(err);
        results.error = err;
        return results;
      });
  } else {
    return error;
  }
};
