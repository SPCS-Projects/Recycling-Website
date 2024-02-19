
$w.onReady(function () {
    // manage bins button to manage bins state box
    $w("#button7").onClick(event => {
        $w("#multiStateBox1").changeState("box2");
    });

    // manage users button to manage users state box
    $w("#button6").onClick(event => {
        $w("#multiStateBox1").changeState("box1");
    });

    // point management button to point management state box
    $w("#button5").onClick(event => {
        $w("#multiStateBox1").changeState("box1");
    });
});