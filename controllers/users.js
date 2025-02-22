const { 
    createUser,
    retrieveUsers,
    retrieveUser,
    getUserWithBiometricData,
    changeUser,
    removeUser,
    createUserProfile,
    retrieveUserProfiles,
    retrieveUserProfile,
    changeUserProfile,
    removeUserProfile,
 } = require("../database/requests")

/* const addUser = async (req, res) => {
    if (!await createUser(req.body)) {
        res.status(500).send("Cannot create user");
    } else {
        res.status(201).send("User added");
    }
} */
const addUser = async (req, res) => {
    /* const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } */
    const response = await createUser(req.body); // Call createUser and get the response
    
    if (!response.success) {
        res.status(500).send(response.message);
        console.log(response); // Send the error message from createUser
        } else {
            res.status(201).send(response.message); // Send the success message from createUser
        }
};

const getUsers = async (req, res) => {
    let usersWithBiometrics;
    if (req.query) {
        usersWithBiometrics = await retrieveUsers(req.query);
    } else {
        usersWithBiometrics= await retrieveUsers()
    }
    res.status(200).json(usersWithBiometrics);
}

const getUser = async (req, res) => {

    const usersWithBiometrics = await retrieveUser(req.params.id)
    res.status(200).json(usersWithBiometrics)
}

const getUserBio = async (req, res) => {
    const biometricsData = await getUserWithBiometricData(req.params.id);
    if (!biometricsData.success) {
        res.status(500).send(biometricsData.message);
    } else {
        res.status(200).json(biometricsData);
    }
}


const updateUser = async (req, res) => {
    if (!await changeUser(req.params.id, req.body)) {
        res.status(500).send("Cannot update user");        
    } else {
        res.status(200).send("User updated");
    }
}
const deleteUser = async (req, res) => {
    if (!await removeUser(req.params.label)) {
        res.status(500).send("Cannot delete user");        
    } else {
        res.status(200).send("User deleted");
    }
}

/**
 * Profile related functions
 */

const addUserProfile = async (req, res) => {
    if (!await createUserProfile(req.body)) {
        res.status(500).send("Cannot create user profile")
    } else {
        res.status(201).send("Profile added")
    }
}
const getUserProfiles = async (req, res) => {
    let profiles;
    if (req.query) {
        profiles = await retrieveUserProfiles(req.query);
    } else {
        profiles = await retrieveUserProfiles();   
    }
    res.status(200).json(profiles)
}
const getUserProfile = async (req, res) => {
    const profile = await retrieveUserProfile(req.params.id);
    res.status(200).json(profile)
}
const updateUserProfile = async (req, res) => {
    if (!await changeUserProfile(req.params.id, req.body)) {
        res.status(500).send("Cannot update profile")
    } else {
        res.status(200).send("Profile updated")
    }
}
const deleteUserProfile = async (req, res) => {
    if (!await removeUserProfile(req.params.id)) {
        res.status(500).send("Cannot delete profile")
    } else {
        res.status(200).send("Profile deleted")
    }
}



module.exports = {
    addUser,
    getUsers,
    getUser,
    getUserBio,
    updateUser,
    deleteUser,
    addUserProfile,
    getUserProfiles,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
