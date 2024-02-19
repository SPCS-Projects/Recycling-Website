import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

const currentUser = wixUsers.currentUser;

// Check if the user is logged in
if (currentUser.loggedIn) {
    wixLocation.to('/redirect');
}
