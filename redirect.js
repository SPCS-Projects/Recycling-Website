import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import wixData from 'wix-data';

const currentUser = wixUsers.currentUser;

// Check if the user is logged in
if (currentUser.loggedIn) {
    // Get the user's role
    const query = wixData.query("users").eq('userID', currentUser.id);
    query.find()
        .then(results => {
        //if user doesn't exist create an entry in the database
        if (results.items.length === 0) {
            wixData.insert("users", {"userID": currentUser.id, "points": 0})
        }
    currentUser.getRoles()
        .then((roles) => {
            let iter = roles["length"]
            let userRoles = []
            for (let i = 0; i < iter; i++) {
                userRoles.push(roles[i]["name"])

            }
            //check if the user is an admin, if so take them to the admin page otherwise the main page that allows recycling
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
