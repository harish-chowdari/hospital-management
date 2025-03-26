const express = require('express');
const router = express.Router();
const { getResource, createResourse } = require('../Controllers/ResourceController');


router.post('/create-resourse', createResourse);
router.get('/get-resource/:appointmentId', getResource);

module.exports = router;