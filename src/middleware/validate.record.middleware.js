const { searchOneUserAccessSurvey } = require("../services/survey.access.service");
const { findSurvey } = require("../services/survey.service");
const {
  handleErrorResponse,
  handleHttpError,
} = require("./handle.error.middleware");

const validateSurveyAvailable = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { allowed_edit_survey } = await findSurvey(code);

    if (allowed_edit_survey !== 1) {
      handleErrorResponse(res, "No se permite editar la ficha", 400);
      return;
    }
    next();
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const validateAccessSurvey = async (req, res, next) => {
  try {
    const { code } = req.params;
    const {role,iduser}=req;
    const { id_survey } = await findSurvey(code);
    req.surveyId=id_survey
    if(role==1){
        next();
        return;
    }
    await searchOneUserAccessSurvey(id_survey,iduser);
    next();
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};
module.exports = {
  validateSurveyAvailable,
  validateAccessSurvey
};
