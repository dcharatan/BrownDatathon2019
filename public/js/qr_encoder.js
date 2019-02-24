function update_qr_code(heights, colors, qr_div, output_p) {
    // Constants.
    const NUM_STATES = 50;

    // Encodes the data in instructions.
    var encoding = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.";
    var instructions = "";

    // Encodes the heights.
    for(var i = 0; i < NUM_STATES; i++) {
        instructions += encoding.charAt(heights[i]);
    }

    // Encodes the heights.
    for(var i = 0; i < NUM_STATES; i++) {
        instructions += encoding.charAt(colors[i]);
    }

    // Creates the QR code.
    var typeNumber = 5;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(instructions);
    qr.make();
    qr_div.innerHTML = qr.createImgTag(10);
    output_p.innerHTML = instructions;
}