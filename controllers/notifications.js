const {
    createNotification,
    retrieveNotifications,
    retrieveNotification,
    changeNotification,
    removeNotification,
    getUsersByAssociation
} = require("../database/requests")


const addNotification = async (req, res) => {
    if (!await createNotification(req.body)) {
        res.status(500).send("Cannot create notification");
    } else {
        res.status(201).send("Notification created")
    }
}

const getNotifications = async (req, res) => {
    let notifs;
    if (req.query) {
        notifs = await retrieveNotifications(req.query)
    } else {
        notifs = await retrieveNotifications()
    }
    res.status(200).json(notifs)
}

const getNotification = async (req, res) => {
    const notifs = await retrieveNotification(req.params.id)
    res.status(200).json(notifs)
}

const updateNotification = async (req, res) => {
    if (!await changeNotification(req.params.id)) {
        res.status(500).send("Cannot update notification")
    } else {
        res.status(200).send("Notification updated")
    }
}

const deleteNotification = async (req, res) => {
    if (!await removeNotification(req.params.id)) {
        res.status(500).send("Cannot delete notification")
    } else {
        res.status().send("Notification deleted")
    }
}

const sendNotification = async (req,res) => {
    const {titre,message,association} = req.body
    const users = await getUsersByAssociation(association)
    const phones = users.map(user => user.phone1);
    //console.log(phones)

    for (let index = 0; index < phones.length; index++) {
        const element = phones[index];
        //console.log(element)
        sendSMS(element,message)
    }

    res.status(200).json(users);
}

/* Send SMS */
const sendSMS = async (numero,message) => {
    const newSMS = {
      to: numero,
      message: message,
      from: "KYCAAS",
      token: "BR4R86Q94USFA44",
    }
    console.log(newSMS)

    try {
      const response = await fetch(
        ` https://api.keccel.com/sms/v2/message.asp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSMS),
          mode: "no-cors", // Disable CORS
        }
      )
      /*   console.log(response)
      if (!response.ok) throw new Error("Failed to Send SMS") */
      /*   const responseData = await response.json()
      console.log(responseData)
      if (responseData.status === "REJECTED") {
        throw new Error("Failed to Send SMS")
      } */

    } catch (error) {
      console.error(error)
    }
  }

module.exports = {
    addNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    sendNotification
};
