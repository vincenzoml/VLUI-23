//@ts-ignore
import { NVImage } from '@niivue/niivue'

addEventListener("message", (e) => {
    NVImage.loadFromUrl({
        url: e.data.overlay,
        opacity: 0.4,
        colormap: 'winter'
        //}).then((img: any) => postMessage({ overlay: e.data.overlay, result: img }))
    }).then((image: any) => {
        const metadata = image.getImageMetadata()
        console.log("WORKER:",image)
        postMessage({ overlay: e.data.overlay, metadata: metadata, buffer: image.img.buffer })
    })
})
