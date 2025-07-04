const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { upload_group_img } = require('../middlewares/group_icon_mw');

router.get('/getConversationAllMessages/:conversationId', conversationController.getConversationAllMessages);
router.get('/getConversationAllMessagesByParticipants/:otherParticipantId', conversationController.getConversationAllMessagesByParticipants);
router.get('/getGroupConversationData/:conversationId', conversationController.getGroupConversationData);
// router.get()
// router.get()
// router.get()
// router.get()
// router.get()
// router.post()
// router.delete('/deleteConversation/:conversationId', conversationController.deleteConversation)
router.post('/deleteConversation', conversationController.deleteConversations)
router.post('/createNewGroup', upload_group_img.single('groupIcon'),conversationController.createNewGroup)
router.post('/addGroupIcon', upload_group_img.single('groupIcon'),conversationController.addGroupIcon)
router.post('/removeGroupIcon', conversationController.removeGroupIcon)
router.post('/editGroupDetails', conversationController.editGroupDetails)

router.post('/exitGroup', conversationController.exitGroup)
router.post('/removeParticipantFromGroup', conversationController.removeParticipantFromGroup)
router.post('/addParticipantsToGroup', conversationController.addParticipantsToGroup)
router.post('/demoteMeFromAdmin', conversationController.demoteMeFromAdmin)

module.exports = router;