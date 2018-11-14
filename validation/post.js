const isEmpty = require('./is-empty');
const validator = require('validator');
module.exports = loginInput = (data) => {
  let errors = {};
  data.text = !isEmpty(data.text)?data.text:'';
  if(!validator.isLength(data.text,{min:10,max:300}))errors.text='Post must be between 10 and 300 characters';
  if (validator.isEmpty(data.text))errors.text = 'text is invalid';
  return {
    errors,
    isValid: isEmpty(errors)
  }
}