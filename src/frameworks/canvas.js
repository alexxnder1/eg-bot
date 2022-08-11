let scaleText = (canvas, def=10, text, font_name) => {
    let fontSize = def;
    var context = canvas.getContext('2d');
    do {
        context.font = `${fontSize -= 5}px ${font_name}`;
    } while(context.measureText(text).width > 250)
    
    return context.font;
}

let createProgressBar = (canvas, val, w, h, fill_color) => {
    var context = canvas.getContext('2d');
    context.fillStyle = fill_color;
    context.fillRect(canvas.width / w, h, val, 12);
    context.strokeRect(canvas.width / w, h, canvas.width / 4, 12);
}

let createText = (canvas, text, w, h, font_size, font_name, color, align, outline=true) => {
    let context = canvas.getContext('2d');
    
    context.font = scaleText(canvas, font_size, text, font_name);
    context.fillStyle = color;
    context.textAlign = align;    
    context.fillText(text, w, h);
    if(outline) context.strokeText(text, w, h);
}

async function createCanvasImage(Canvas, context, img_url, dx, dy, w, h) {
    const img = await Canvas.loadImage(`${img_url}`);
    context.drawImage(img, dx, dy, w, h); 
}

module.exports = { createText, scaleText, createCanvasImage, createProgressBar };