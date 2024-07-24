const express = require('express');
const { 
    addNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    sendNotification
 } = require('../controllers/notifications');
const router = express.Router();

router.route("/send_notification/")
.post(sendNotification)


router.route("/")
.get(getNotifications)
.post(addNotification)

router.route("/:id")
.get(getNotification)
.put(updateNotification)
.delete(deleteNotification)







module.exports = router;