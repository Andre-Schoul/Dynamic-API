const fs = require("fs");
const fsp = require('fs').promises;
const model = require('./model');
const controller = require('./controller');
const route = require('./route');

/**
 * Creates a directory ata given path if it doesn't exist already
 * @param {string} path Path to where the directory should be created
 * @param {number} mask Optional mask
 * @param {Function} callback Callback function
 */
const createDirectory = (path, mask, callback) => {
  // Allow 'mask' parameter to be optional
  if (typeof mask == 'function') {
      callback = mask;
      mask = 0777;
  }
  fs.mkdir(path, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') {
            // Ignore the error if the folder already exists
            callback(null);
          } else {
            // Something else went wrong
            callback(err);
          }
      } else {
        // Successfully created folder
        callback(null);
      }
  });
}

/**
 * Creates a directory ata given path if it doesn't exist already
 * @param {string} path Path to where the directory should be created
 * @param {number} mask Optional mask
 */
const createDirectory2 = async (path, mask) => {
  // Allow 'mask' parameter to be optional
  if (typeof mask == 'function') {
      callback = mask;
      mask = 0777;
  }
  try {
    await fsp.mkdir(path, mask);
  } catch (err) {
    console.log(err);
  }
}


const removeDirectory = (path) => {

}

/**
 * Creates a file at a given directory
 * @param {string} path A Path to where the file should be created
 * @param {JSON} data The data to write into the file
 */
const createFile = (path, data) => {
  fs.writeFile(path, data, (error, res) => {
      if (error) {
        console.log(error);
      }
  });
}

/**
 * Creates a file at a given directory
 * @param {string} path A Path to where the file should be created
 * @param {JSON} data The data to write into the file
 * @param {Function} callback Callback function
 */
const createFile2 = (path, data, callback) => {
  fs.writeFile(path, data, (error, res) => {
      if (error) {
        console.log(error);
      }
      callback();
  });
}

/**
 * Creates a file at a given directory
 * @param {string} path A Path to where the file should be created
 * @param {JSON} data The data to write into the file
 */
const createFile3 = async (path, data) => {
  let file;
  try {
    file =  await fsp.writeFile(path, data);
  } catch (err) {
    console.log(err);
  }
  return file;
};

/**
 * Deletes a file at a given directory
 * @param {string} path A Path to where the file should be deleted
 */
const deleteFile = (path) => {
  fs.unlink(path, (error) => {
    if (error) {
      console.log(error);
    }
  });
}
/**
 * Deletes a file at a given directory
 * @param {string} path A Path to where the file should be deleted
 */
const deleteFile2 = async (path) => {
  try {
    await fsp.unlink(path);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Checks a directory if a file exists
 * @param {string} path A Path to the directory
 * @param {string} name A file to find in the given directory
 */
const findFileInDirectory = (path, name) => {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
}

const getFilesInDirectory = (path) => {
  return fs.readdirSync(path, (error) => {
    if (error) {
      console.log(error);
      return;
    }
  });
}

/**
 * Mounts an endpoint to the router at a given path
 * @param {string} path A Path to the directory
 * @param {Express} router Express router to mount routes to
 */
const mountEndpoint = (path, router) => {
  const module = require(`../routes/${path}`);
  router.use(`/${module.plural ? `${module.plural}` : `${path}s`}`, module);
}

/**
 * Mounts an endpoint to the router at a given path
 * @param {string} path A Path to the directory
 * @param {Express} router Express app to mount routes to
 * @param {boolean} isDirectory Wether all files in an directory or a single file should be mounted
 */
const mountEndpoints = (path, router) => {
  getFilesInDirectory(path).map(endpoint => {
    endpoint = endpoint.substr(0, endpoint.lastIndexOf("."));
    const module = require(`../routes/${endpoint}`);         
    //router.use(`/${module.plural ? `${module.plural}` : `${endpoint}s`}`, module);
    if (endpoint === 'database') {
      router.use(`/projects/:projectId/${module.plural ? `${module.plural}` : `${endpoint}s`}`, module);
    } else {
      router.use(`/${module.plural ? `${module.plural}` : `${endpoint}s`}`, module);
    }
  });
}

/**
 * Transforms the first letter of a string to an uppercase letter
 * @param {string} s String to transform first letter
 * @returns {string} The string with its first letter capitalized
 */
const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Creates an API endpoint with model, controller & route files
 * @param {JSON} name The name (singular & plural) of the endpoint
 * @param {JSON} data The data of the endpoint
 * @param {JSON} auth Specification for authentication for the different endpoints
 */
/*const createEndpoint = (name, data, auth) => {
  if (!findFileInDirectory(`./api/models/${name.singular}.js`) &&
      !findFileInDirectory(`./api/controllers/${name.singular}.js`) &&
      !findFileInDirectory(`./api/routes/${name.singular}.js`)) {
    createFile2(`./api/models/${name.singular}.js`, model.createModel(capitalize(name.singular), data), () => {
      createFile2(`./api/controllers/${name.singular}.js`, controller.createController({singular: capitalize(name.singular), plural: name.plural}, data.data), () => {
        createFile2(`./api/routes/${name.singular}.js`, route.createRoute({singular: capitalize(name.singular), plural: name.plural}, auth), () => {
          const app = require('../../app');
          mountEndpoint(name.singular, app.dynamicRouter);
        });
      });
    });    
    return true;
  } else {
    console.log(`Couldn't create API endpoint`);
    return false;
  }
};*/
const createEndpoint = async (name, data, auth) => {
  if (!findFileInDirectory(`./api/models/${name.singular}.js`) &&
      !findFileInDirectory(`./api/controllers/${name.singular}.js`) &&
      !findFileInDirectory(`./api/routes/${name.singular}.js`)) {
    await createFile3(`./api/models/${name.singular}.js`, model.createModel(capitalize(name.singular), data));
    await createFile3(`./api/controllers/${name.singular}.js`, controller.createController({singular: capitalize(name.singular), plural: name.plural}, data.data));
    await createFile3(`./api/routes/${name.singular}.js`, route.createRoute({singular: capitalize(name.singular), plural: name.plural}, auth));
    await mountEndpoint(name.singular, require('../../app').dynamicRouter);
    return true;
  } else {
    console.log(`Couldn't create API endpoint`);
    return false;
  }
};

const deleteEndpoint = async (name) => {
  await deleteFile2(`./api/models/${name}.js`);
  await deleteFile2(`./api/controllers/${name}.js`);
  await deleteFile2(`./api/routes/${name}.js`);
  require('../../app').setupRouter();
}

exports.createEndpoint = createEndpoint;
exports.mountEndpoints = mountEndpoints;
exports.deleteEndpoint = deleteEndpoint;
exports.findFileInDirectory = findFileInDirectory;
exports.createDirectory = createDirectory2;