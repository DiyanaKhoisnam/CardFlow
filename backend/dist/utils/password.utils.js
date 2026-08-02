"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
/**
 * Hashes a plaintext password securely using bcrypt with 10 salt rounds.
 */
const hashPassword = async (password) => {
    return await bcrypt_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
const comparePassword = async (password, hash) => {
    return await bcrypt_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
