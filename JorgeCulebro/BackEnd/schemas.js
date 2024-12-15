import Joi from 'joi';

//schemas
const schemaUser = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.any(),
  profileImage: Joi.any()
});

const schemaLogin = Joi.object().keys({
  userName: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).required
});

const schemaProduct = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.any(),
  height: Joi.any(),
  length: Joi.any(),
  width: Joi.any()
});

const schemaAllProducts = Joi.object().keys({
  get: Joi.any()
});

//export schemas to validator
export default {
    "/Routes/userRoute.js": schemaUser,
    "/Routes/loginRoute.js": schemaLogin,
    "/Routes/productRoute.js": schemaProduct,
    "/Routes/productRoute.js": schemaAllProducts
};