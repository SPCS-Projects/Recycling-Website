import wixData from 'wix-data';

function hide(item) {
    $w(item).collapse()
    $w(item).hide()
}

function show(item) {
    $w(item).show()
    $w(item).expand()
}

let _id = ""
let binName = ""
let location = ""
let capacity = 0

hide("#emptyBin")

// Function to generate a random string for the bin ID
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function editBin(ID){
    $w("#submitBtn").label = "Edit Bin"
    _id = ID
    wixData.query('recycling_bins').eq("_id", ID)
        .find()
        .then(res => {
            let data = res.items[0]
            $w("#inputBinName").value = data.binName
            $w("#inputLocation").value = data.location
            $w("#inputCapacity").value = data.capacity
            binName = data.binName
            location = data.location
            capacity = data.capacity
            show("#emptyBin")   
        })
        .catch(err => {
            console.error('Failed to load bins', err);
        });
}

// Function to load bins into the repeater
function loadBins() {
    wixData.query('recycling_bins')
        .find()
        .then(res => {
            $w('#repeater2').data = res.items;
            $w('#repeater2').forEachItem(($item, itemData, index) => {
                $item('#textBinName').text = itemData.binName;
                $item('#buttonEdit').onClick(() => editBin(itemData._id)); // need to implement edit button 
                $item('#buttonDelete').onClick(() => deleteBin(itemData._id));
            });
        })
        .catch(err => {
            console.error('Failed to load bins', err);
        });
}

// Function to delete a bin
function deleteBin(binId) {
    wixData.remove('recycling_bins', binId)
        .then(() => {
            loadBins(); 
        })
        .catch(err => {
            console.error('Failed to delete bin', err);
        });
}

// Function to handle form submission
async function submitBtn_click(event) {
    if ($w("#submitBtn").label == "Submit"){
        const binId = generateRandomString(20);
        let locationInput = $w("#inputLocation").value.trim();
        const googleMapsLink = `https://www.google.com/maps/place/${locationInput.replace(/ /g, '+')}/`;
        const newBin = {
            "binId": binId,
            "binName": $w("#inputBinName").value.trim(),
            "location": locationInput,
            "gmaps": googleMapsLink,
            "capacity": parseInt($w("#inputCapacity").value, 10),
            "recycling": 0,
            "full": false
        };

        if(newBin.binName && newBin.location && !isNaN(newBin.capacity)) {
            // Adding new bin in database
            wixData.insert("recycling_bins", newBin)
                .then((results) => {
                    loadBins(); 
                    console.log("New bin added successfully:", results);
                    // Clear input fields after successful submission
                    $w("#inputBinName").value = "";
                    $w("#inputLocation").value = "";
                    $w("#inputCapacity").value = "";
                })
                .catch((error) => {
                    console.error("Error adding new bin:", error);
                });
        } else {
            console.error("Please fill all required fields correctly.");
        }
    }
    if ($w("#submitBtn").label == "Edit Bin"){
        if ($w("#inputBinName").value && $w("#inputLocation").value && parseInt($w("#inputCapacity").value) > 0) {
            await wixData.get("recycling_bins", _id)
                .then((item) => {
                    let toUpdate = item;
                    console.log(toUpdate.binName)
                    toUpdate.binName = $w("#inputBinName").value.trim() || binName;
                    console.log(toUpdate.binName, $w("#inputBinName").value)
                    toUpdate.location = $w("#inputLocation").value.trim() || location;
                    toUpdate.capacity = parseInt($w("#inputCapacity").value) || capacity
                    if ($w("#emptyBin").checked == true){
                        toUpdate.recycling = 0
                        toUpdate.full = false
                    }
                    console.log(toUpdate)
                    wixData.update("recycling_bins", toUpdate)
                    
                    // .then((results) => {
                    //     console.log(results)
                    // })
                    // .catch((err) => {
                    //     console.log(err)
                    // })
                })
            loadBins();
            $w("#submitBtn").label = "Submit"
            hide("#emptyBin")
            $w("#inputBinName").value = "";
            $w("#inputLocation").value = "";
            $w("#inputCapacity").value = "";
        }
        else{
            if ($w("#inputBinName").value === "") $w("#inputBinName").required = true;
            if ($w("#inputLocation").value === "") $w("#inputLocation").required = true;
            if (parseInt($w("#inputCapacity").value) > 0) $w("#inputCapacity").required = true;
        }
    }
}

function loadRewards() {
    wixData.query('rewards')
        .find()
        .then(res => {
            $w('#repeaterRewards').data = res.items; 
            $w('#repeaterRewards').forEachItem(($item, itemData, index) => {
                $item('#textRewardTitle').text = itemData.rewardTitle;
                // $item('#textRewardCost').text = itemData.rewardCost.toString(); //for editing rewards
                // $item('#buttonEditReward').onClick(() => editReward(itemData._id)); // need to implement edit button 
                $item('#buttonDeleteReward').onClick(() => deleteReward(itemData._id));
            });
        })
        .catch(err => {
            console.error('Failed to load rewards', err);
        });
}

// Function to delete a reward
function deleteReward(rewardId) {
    wixData.remove('rewards', rewardId)
        .then(() => {
            loadRewards(); 
        })
        .catch(err => {
            console.error('Failed to delete reward', err);
        });
}

// Function for rewards
function submitReward_click(event) {
    const rewardId = generateRandomString(20);
    const newReward = {
        "rewardID": rewardId,
        "rewardTitle": $w("#inputRewardName").value.trim(),
        "rewardCost": parseInt($w("#inputRewardCost").value, 10)
    };

    if(newReward.rewardTitle && !isNaN(newReward.rewardCost)) {
        // 
        wixData.insert("rewards", newReward)
            .then(() => {
                loadRewards(); 
                // 
                $w("#inputRewardName").value = "";
                $w("#inputRewardCost").value = "";
            })
            .catch((error) => {
                console.error("Error adding new reward:", error);
            });
    } else {
        console.error("Please fill all required fields correctly.");
    }
}

$w.onReady(function () {
    loadBins();


    $w("#btnBinManage").onClick(() => {
        loadBins();
        $w("#multiStateBox1").changeState("stBoxBins");
    });

    $w("#btnUserManage").onClick(() => {
        $w("#multiStateBox1").changeState("stBoxUsers");
    });

    $w("#btnRewardManage").onClick(() => {
        loadRewards();
        $w("#multiStateBox1").changeState("stBoxPoints");
    });

    $w("#addRewardButton").onClick(submitReward_click);
    
    $w("#submitBtn").onClick(submitBtn_click);

    $w("#repeater2").onItemReady(($item, itemData) => {
        // $item("#buttonEdit").onClick(() => editBin(itemData._id)); // need to implement edit button 
        $item("#buttonDelete").onClick(() => deleteBin(itemData._id));
    });
});
