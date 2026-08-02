"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
// HTTP Morgan Logger configuration
exports.httpLogger = (0, morgan_1.default)(env_1.config.nodeEnv === 'development'
    ? ':method :url :status :response-time ms - :res[content-length]'
    : 'combined');
