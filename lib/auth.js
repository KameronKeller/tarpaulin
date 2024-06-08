const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const SECRET_KEY = "random-secret-key-P7YlYdCRJOiE9LUt4GjqrNnhVfrWDcwi";
const { getAssignment } = require("../models/assignment");
const { getCourse } = require("../models/course");
const ROLES = {
  admin: "admin",
  instructor: "instructor",
  student: "student",
};

function generateAuthToken(userId) {
  const payload = { sub: userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
}

async function validateUser(user, password) {
  const authenticated = user && (await bcrypt.compare(password, user.password));
  return authenticated;
}

async function authenticate(req, res, next) {
  const authHeader = req.get("Authorization") || "";
  const authHeaderParts = authHeader.split(" ");
  const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null;
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    // TODO: get the user role here from DB here
    req.userId = payload.sub;
    // const user = await <DBQUERY>
    // append the role to the req so it can be passed to the authorize middleware
    // req.role = user.role;

    // TODO: delete this once the DB is set up, this is only for testing
    req.role = "admin";

    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid authentication token provided.",
    });
  }
}
// TODO: Discuss with group how this should be implemented using the token
// instead of the request body
// Sources:
// - https://stackoverflow.com/a/63363711/7100879
// - https://stackoverflow.com/a/70934663/7100879
function authorize(allowedRoles) {
  return function (req, res, next) {
    if (allowedRoles.includes(req.role)) {
      return next();
    } else {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }
  };
}

function isOwnerOfAssignment(req, res, next) {
  if (req.role === "admin") {
    next();
  } else if (req.role === "instructor") {
    try {
      var assignment = getAssignment(req.params.id);
      var course = getCourse(assignment.courseId);
      if (course.instructorId === req.userId) {
        next();
      } else {
        res.status(403).json({
          error: "Unauthorized",
        });
      }
    } catch(err) {
      res.status(403).json({
        error: "Unauthorized"
      });
    }
  } else {
    res.status(403).json({
      error: "Unauthorized"
    });
  }
}

exports.ROLES = ROLES;
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.validateUser = validateUser;
exports.generateAuthToken = generateAuthToken;
exports.isOwnerOfAssignment = isOwnerOfAssignment;
