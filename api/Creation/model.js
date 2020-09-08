const allTypes = [
  // Boolean or function, if true adds a required validator for this property
  'required',
  // Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default
  'default',
  // Boolean, specifies default projections for queries
  'select',
  // String, defines a virtual with the given name that gets/sets this path
  'alias',
  // Boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has isNew: true
  'immutable'
]

const modelType = [
  { type: String, options: [
    // Boolean, whether to always call .toLowerCase() on the value
    'lowercase',
    // Boolean, whether to always call .toUpperCase() on the value
    'uppercase',
    // Boolean, whether to always call .trim() on the value
    'trim',
    // RegExp, creates a validator that checks if the value matches the given regular expression
    'match',
    // Array, creates a validator that checks if the value is in the given array
    'enum',
    // Number, creates a validator that checks if the value length is not less than the given number
    'minlength',
    // Number, creates a validator that checks if the value length is not greater than the given number
    'maxlength',
    typeof allTypes
  ]},
  { type: Number, options: [
    // Number, creates a validator that checks if the value is greater than or equal to the given minimum
    'min',
    // Number, creates a validator that checks if the value is less than or equal to the given maximum
    'max',
    // Array, creates a validator that checks if the value is strictly equal to one of the values in the given array
    'enum',
    typeof allTypes
  ]},
  { type: Date, options: [
    // Date
    'min',
    // Date
    'max',
    typeof allTypes
  ]},
  {type: Buffer, options: [typeof allTypes]},
  {type: Boolean, options: [typeof allTypes]},
  {type: Array, options: [typeof allTypes]},
  {type: 'Schema', options: [typeof allTypes]},
  'Schema.Types.Mixed',
  'Schema.Types.Decimal128',
  'Schema.Types.ObjectId'
];
exports.modelType = modelType;

/**
 * Creates a mongoose model
 * @param {string} name The name of the model
 * @param {JSON} data The data of the model
 * @returns {string} The model as a string
 */
exports.createModel = (name, data) => {
  return `const mongoose = require('mongoose');
const ${name.toLowerCase()}Schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, ${data.data.map(({property, type, required, ...values}) => {
  // Minimal requirements are 'property' & 'type'
  if (!property || ! type) {
    console.log(`Please add at least a property and a type`);
    return;
  }
  // Append additional values
  let additionalInfo;
  if (Object.keys(values).length > 0 && values.constructor === Object) {
    additionalInfo = Object.entries(values).map(([key, value], index) => (
      index === 0 ?
      additionalInfo =  `${key}: ${value}` :
      additionalInfo = ` ${key}: ${value}`
    ));
  }
  return `\n  ${property}: {type: ${type}, required: ${required || false}${
    additionalInfo ? `, ${additionalInfo}` : ''}}`;
})}
});

${Object.entries(data.preHooks).map(([key, value]) => {
  return value ? `${name.toLowerCase()}Schema.pre('${key}', function(next) {

});\n\n` : ''
}).join('')}
${Object.entries(data.postHooks).map(([key, value]) => {
  return value ? `${name.toLowerCase()}Schema.post('${key}', function(next) {

});\n\n` : ''
}).join('')}
module.exports = mongoose.model('${name}', ${name.toLowerCase()}Schema);`;
};
