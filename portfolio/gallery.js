const CARD_SIZES = {
    "sm card": 2,
    "md card": 3,
    "lg card": 4,
}

function calcSpacing() {
    let G_WIDTH = 6;

    let gal_width = visualViewport.height * .5;

    let card_size = gal_width * .9 / G_WIDTH;
    let card_spacing = gal_width * .1 / Math.max(G_WIDTH - 1, 1);
    
    let cName = visualViewport.width < 768 ? "card-deck mobile" : "card-deck gallery";

    if(cName != gallery.className) {
        gallery.className = cName;
        buildGallery(G_WIDTH, card_size, card_spacing);

        if(visualViewport.width < 768)
            gallery.style.height = null;
    }
}

function buildGallery(G_WIDTH, card_size, card_spacing) {

    let x0 = 1;
    let y0 = 1;
    
    let row = [];
    let row_height = 0;
    let row_width = 0;
    let area = 0;

    for(const element of gallery.children) {
        row.push(element);
        let size = CARD_SIZES[element.className.substring(0, 7)];

        if(G_WIDTH == 1)
            size = 1;

        area += size * size;
        row_width += size;
        row_height = Math.max(size, row_height);
    
        //place elements
        if(row_width >= G_WIDTH && G_WIDTH * row_height == area) {
            let x = x0;
            let y = y0;
    
            for(const card of row) {
                let size = CARD_SIZES[card.className.substring(0, 7)];
    
                if(G_WIDTH == 1)
                    size = 1;
                    
                const nx = (x - 1) * card_size + (x - 1) * card_spacing;
                const ny = (y - 1) * card_size + (y - 1) * card_spacing;
                const nsize = card_size * size + (size - 1) * card_spacing;
    
                card.style.setProperty('--left', Math.floor(nx) + 'px');
                card.style.setProperty('--top', Math.floor(ny) + 'px');
                card.style.setProperty('--width', Math.floor(nsize) + 'px');

                y += size;
    
                if(y + size > y0 + row_height) {
                    x += size;
                    y = y0;
                }
            }
    
            x0 = 1;
            y0 += row_height;
    
            row = [];
            row_width = 0;
            row_height = 0;
            area = 0;
        }
    }

    const gal_height = (y0 - 1) * card_size + (y0 - 2) * card_spacing;
    const gal_width = G_WIDTH * card_size + (G_WIDTH - 1) * card_spacing;
    gallery.style.height = gal_height + "px";
    
    for(const card of gallery.children) {
        const yProp = card.style.getPropertyValue('--top');
        const initY = parseInt(yProp.substring(0, yProp.length - 2));

        const width = gal_width * 5 / 6;
        const cx = gal_width/2 - width / 2;
        const cy = initY * gal_height / (gal_height + width * 2);

        card.style.setProperty('--centerX', Math.floor(cx) + 'px');
        card.style.setProperty('--centerY', Math.floor(cy) + 'px');
    }
}

document.onmousemove = (e) => {
    if(!gallery || gallery.className == "card-deck mobile")
        return;

    let card_focus = document.getElementsByClassName("focus")[0];
    
    if(!card_focus)
        return;

    let focus = card_focus.children[0];

    let x = e.clientX;
    let y = e.clientY;
    
    let box = focus.getBoundingClientRect();

    let calcX = (x - box.x - (box.width / 2)) / 20;
    let calcY = -(y - box.y - (box.height / 2)) / 20;

    let length = Math.sqrt(calcX * calcX + calcY * calcY);

    if(length > 4) {
        calcX = calcX / length * 4;
        calcY = calcY / length * 4;
    }

    focus.style.setProperty('--xRot', `${calcY}deg`);
    focus.style.setProperty('--yRot', `${calcX}deg`);

    let overlay = focus.getElementsByClassName("card-overlay")[0];
    overlay.style.setProperty('--xShift', `${50 - 7*calcX}%`);
    overlay.style.setProperty('--yShift', `${70 - 7*calcY}%`);
};


window.addEventListener('resize', calcSpacing);

let gallery;
window.addEventListener('load', () => {
    gallery = document.getElementById("gallery");

    calcSpacing();
})