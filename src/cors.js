import { constants } from "./constants.js";

export const cors = (_request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader('Access-Control-Allow-Methods', constants.supportedMethods.join(','));
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
