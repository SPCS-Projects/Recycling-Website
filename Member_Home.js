import wixData from 'wix-data';

async function popRepeaters() {
    let bin_data;
    const query = wixData.query("recycling_bins")
    // Run the query, we have await so code doesn't execute before its ready
    await query.find()
        .then(results => {
            bin_data = results.items; // this will get an array of all the rows as jsons
        })

    //map the repeater elements to the input data
    $w('#repeater1').onItemReady( ($item, itemData, index) => {
        $item('#binName').text = (itemData.binName).toString();
        $item('#location').text = (itemData.location).toString();
        $item('#gmaps').link = (itemData.gmaps).toString();
        $item('#recycle').link = '/recycling-bins/'+(itemData.binID).toString();     
    });

    // Set repeater data after processing
    $w('#repeater1').data = bin_data
}

$w.onReady(function () {
    popRepeaters()
})