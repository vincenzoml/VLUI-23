niivue.js:2815: let response = await fetch(url);
niivue.js:2821: dataBuffer = await response.arrayBuffer();
niivue.js:2869: nvimage = new NVImage(...)

nvimage.js:332: imgRaw = nifti.readImage(this.hdr, nifti.decompress(dataBuffer));
nvimage.js:616: if (!isNaN(cal_max)) this.hdr.cal_max = cal_max;
