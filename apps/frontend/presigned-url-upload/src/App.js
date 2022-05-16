import "./styles.css";

const backendServer = "http://localhost:8088"

const App = () => {

  const handleImportImage = async (e) => {
      
    if (e.target.files) {
      let imageFile = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        let img = document.createElement("img");
        img.onload = function (event) {
              document.getElementById("origImgPreview").src = img.src;
              // Dynamically create a canvas element
              let canvas = document.createElement("canvas");
              let ctx = canvas.getContext("2d");

              let width = img.width;
              let height = img.height;
              // let resizeRate = 0.7;
              let resizeRate = document.getElementById("resizeRate").value / 100;
              console.log(resizeRate);
              width = 1024 * resizeRate;
              height = 576 * resizeRate;
              console.log(width, height);

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              console.log(width, height);
              // Show resized image in preview element
              let dataurl = canvas.toDataURL(imageFile.type);
              document.getElementById("resizedImgPreview").src = dataurl;
          }
          img.src = e.target.result;
      }
      reader.readAsDataURL(imageFile);
    }
  };

  const resizeImage = (imgToResize, resizingFactor=0.5) => {
    return imgToResize
  }

  const handleSubmit = async (e) => {
    const file = document.getElementById("image").files[0];
    let resizedImage = resizeImage(file);
    const requestUploadUrl = backendServer+'/requestUpload/'+file.name
    const res = await fetch(requestUploadUrl)
    const signedUrl = await res.text()
    console.log("Post SignedUrl: ", signedUrl)

    const arrayBuffer = await resizedImage.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      // type: resizedImage.type
    });
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: blob,
      mode: "cors"
    });
    console.log("Upload result: ", response.ok)

    const requestDownloadUrl = backendServer+'/requestDownload/'+file.name
    const downloadResp = await fetch(requestDownloadUrl)
    const imgDownloadUrl = await downloadResp.text() 
    console.log("Download SignedURL:", imgDownloadUrl)
    const downloadLink = document.getElementById("download-link");
    downloadLink.href = imgDownloadUrl
    console.log("HyperLink:", downloadLink.href)
    // Show download info after get the signedUrl
    var downloadInfo = document.getElementById("downloadInfo");
    downloadInfo.style.display = "block";
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
        <input type="number" id="resizeRate" name="resizeRate" min="0" max="100" step="10" defaultValue="50" />%

        <div>
          <h3>Resized Image Preview</h3>
          <img src="" id="resizedImgPreview" alt="" />
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