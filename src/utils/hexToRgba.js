const hexToRgba = (hex, alpha) => {
	let h;
	let a = (alpha > 100 ? 100 : alpha < 0 ? 0 : alpha) / 100;
	if (/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		h = hex.split("");
		if(h.length === 3){
			h = [h[0], h[0], h[1], h[1], h[2], h[2]];
		}
		h = "0x" + h.join("");
		return `rgba(${[(h>>16)&255, (h>>8)&255, h&255].join(",")},${a})`;
	}
}

export default hexToRgba;
