"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const card_validator_1 = require("../validators/card.validator");
const router = (0, express_1.Router)();
// All card endpoints require authentication
router.use(auth_middleware_1.authenticateJwt);
router.get('/', card_controller_1.CardController.getUserCards);
router.get('/:id', card_controller_1.CardController.getCardById);
router.patch('/:id/status', (0, validate_middleware_1.validateRequest)(card_validator_1.updateCardStatusSchema), card_controller_1.CardController.updateCardStatus);
exports.default = router;
