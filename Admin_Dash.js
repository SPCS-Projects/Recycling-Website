$w.onReady(function () {
    // manage bins button to manage bins state box
    $w("#btnBinManage").onClick(event => {
        $w("#multiStateBox1").changeState("stBoxBins");
    });

    // manage users button to manage users state box
    $w("#btnUserManage").onClick(event => {
        $w("#multiStateBox1").changeState("stBoxUsers");
    });

    // manage rewards button to manage rewards
    $w("#btnRewardManage").onClick(event => {
        $w("#multiStateBox1").changeState("stBoxPoints");
    });
});
