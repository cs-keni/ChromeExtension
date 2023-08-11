document.addEventListener ("DOMContentLoaded", () => {
    const dropArea = document.getElementById ("drop-area");
    const statusDiv = document.getElementById ("status");

    // prevent default drag behaviors
    dropArea.addEventListener ("dragover", (e) => {
        e.preventDefault ();
        e.stopPropagation ();
        dropArea.classList.add ("drop-hover");
    });

    // remove highlight when file is no longer dragged over
    dropArea.addEventListener ("dragleave", () => {
        dropArea.classList.remove ("drop-hover");
    });

    // handle file drop
    dropArea.addEventListener ("drop", async (e) => {
        e.preventDefault ();
        e.stopPropagation ();
        dropArea.classList.remove ("drop-hover");

        const files = e.dataTransfer.files;

        // check if at least one file was dropped and if JPG file
        if (files.length > 0 && files[0].type === "image/jpeg") {
            const file = files[0];

            try {
                const img = new Image ();
                img.src = URL.createObjectURL (file);

                img.onload = async () => {
                    const canvas = document.createElement ("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext ("2d");
                    ctx.drawImage (img, 0, 0);

                    // convert canvas image to PNG data URL
                    const pngDataUrl = canvas.toDataURL ("image/png");

                    // create new blob with PNG data URL
                    const pngBlob = await fetch (pngDataUrl).then ((res) => res.blob ());

                    // create download link for PNG file
                    const downloadLink = document.createElement ("a");
                    downloadLink.href = URL.createObjectURL (pngBlob);
                    downloadLink.download = file.name.replace (".jpg", ".png");
                    downloadLink.textContent = "Download PNG";

                    // append download link to status div
                    statusDiv.innerHTML = "";
                    statusDiv.appendChild (downloadLink);
                };
            } catch (error) {
                alert ("Error converting the image to PNG.");
            }
        } else {
            alert ("Please drop a valid JPG file.");
        }
    });
});