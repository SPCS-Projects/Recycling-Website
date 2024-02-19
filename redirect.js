import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import wixData from 'wix-data';

const currentUser = wixUsers.currentUser;

// Check if the user is logged in
if (currentUser.loggedIn) {
    // Check if the user exists in the database yet, and adds them if not
    const query = wixData.query("users").eq('userID', currentUser.id);
    query.find()
        .then(results => {
        if (results.items.length === 0) {
            wixData.insert("users", {"userID": currentUser.id, "points": 0})
        }
    // Checks the users roles to see if they should send them to the admin dashbaord
    currentUser.getRoles()
        .then((roles) => {
            let iter = roles["length"]
            let userRoles = []
            for (let i = 0; i < iter; i++) {
                userRoles.push(roles[i]["name"])

            }
            if (userRoles.includes("Admin")) {
                wixLocation.to('/admin-dashboard');
            } else {
                wixLocation.to('/main');
            }

        })
        .catch((error) => {
            console.error(error);
        });

}
