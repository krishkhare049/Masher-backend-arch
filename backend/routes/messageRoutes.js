const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// router.get('/:messageId', messageController.getMessage)
router.post('/addMessage', messageController.addMessage);
router.post('/addMessageToGroup', messageController.addMessageToGroup);
router.post('/unsendMessages', messageController.unsendMessages)
router.post('/markMessagesAsDelivered', messageController.markMessagesAsDelivered)
// router.get()
// router.get()
// router.get()
// router.get()

module.exports = router;