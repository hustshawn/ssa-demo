import "./styles.css";

const backendServer = "http://localhost:8088"

const App = () => {

  const handleImportImage = async (e) => {
    showDownloadInfo(false);
    if (e.target.files) {
      let imageFile = e.target.files[0];
      console.log("ImageFile:", imageFile);
      let reader = new FileReader();
      reader.onload = (e) => {
        let img = document.createElement("img");
        img.onload = function (event) {
            document.getElementById("origImgPreview").src = img.src;
            resizeImage(img);
        }
        img.src = e.target.result;
      }
      reader.readAsDataURL(imageFile);
    }
  };

  const handleResizeFactorChange = async (e) => {
    showDownloadInfo(false);
    let resizeFactor = e.target.value / 100;
    console.log("Resize factor:", resizeFactor);
    let imageToResize = document.getElementById("origImgPreview");
    resizeImage(imageToResize, resizeFactor);

  };

  const resizeImage = (imgToResize, resizingFactor=0.5) => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, canvas.width, canvas.height);
    console.log("Image Original size: ", imgToResize.width, imgToResize.height);
    let resizeRate = document.getElementById("resizeRate").value / 100;
    console.log(resizeRate);

    let width = imgToResize.width * resizeRate;
    let height = imgToResize.height * resizeRate;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgToResize, 0, 0, width, height);
    console.log("Resized size: ", width, height);
    return
  }

  const showDownloadInfo = (display=false) => {
    const downloadInfo = document.getElementById("downloadInfo");
    if (!display) {
      downloadInfo.style.display = "none";
    }else {
      downloadInfo.style.display = "block";
    }
  }

  const handleSubmit = async (e) => {
    const file = document.getElementById("image").files[0];
    const canvas = document.getElementById("canvas");
    const requestUploadUrl = backendServer+'/requestUpload/'+file.name
    const res = await fetch(requestUploadUrl)
    const signedUrl = await res.text()
    console.log("Post SignedUrl: ", signedUrl)

    canvas.toBlob(
      async (blob) => {
        const response = await fetch(signedUrl, {
          method: "PUT",
          body: blob,
          mode: "cors"
        });
        console.log("Upload result: ", response.ok)

        if (response.ok) {
          const requestDownloadUrl = backendServer+'/requestDownload/'+file.name
          const downloadResp = await fetch(requestDownloadUrl)
          const imgDownloadUrl = await downloadResp.text() 
          console.log("Download SignedURL:", imgDownloadUrl)
          const downloadLink = document.getElementById("download-link");
          downloadLink.href = imgDownloadUrl
          console.log("HyperLink:", downloadLink.href)
          // Show download info after get the signedUrl
          showDownloadInfo(true);
        }
      }, file.type, 0.9
    );
  }

  return (
    <div className="App">
      <div style={styles.container}>
        <h2>Image Resizer Demo </h2>
        <label>Upload Image: </label>
        <input id="image" type="file" accept="image/*" onChange={handleImportImage} />
        <h3>Original Image Preview</h3>
        <img src="" id="origImgPreview" alt="" />
        <br></br>
        <p> Define the new size of your image using: </p>
        <input type="number" id="resizeRate" name="resizeRate" min="0" max="100" step="10" defaultValue="50" onChange={handleResizeFactorChange}/>%

        <div>
          <h3>Resized Image Preview</h3>
          <canvas id="canvas"></canvas>
        </div>
        <button style={styles.button} onClick={handleSubmit}>Upload</button>
        <div id="downloadInfo" style={styles.downloadInfo} >
          <h2>Download Image</h2>
          <p>Download <a id="download-link" href="http://example.com">link</a> <br></br><span>Note: The download link will expire in certain period.</span></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { margin: '0 auto', justifyContent: 'center', padding: 20 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  button: { cursor: 'pointer', backgroundColor: 'black', color: 'white', outline: 'none', padding: '5px 5px', width: '147px', heigh: '35px' },
  downloadInfo: {display: 'none'}
}

export default App