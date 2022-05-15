import "./styles.css";

const backendServer = "http://localhost:8088"

const App = () => {

  const handleImportImage = async (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    var img = document.getElementById("origImgPreview")
    reader.onload = function(e) {img.src = e.target.result}
    reader.readAsDataURL(file);
  };

  const resizeImage = (imgToResize, resizingFactor=0.5) => {
    // var canvas = document.createElement("canvas");
    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(imgToResize, 0, 0);
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
  }

  return (
    <div className="App">
      <div style={styles.container}>
        <h2>Image Resizer Demo </h2>
        <input id="image" type="file" accept="image/*" onChange={handleImportImage} />
        {/* <p>Upload percentage: <span id="uploadPercent"></span> </p> */}
        <h3>Preview</h3>
        <img src="" id="origImgPreview" alt="" />
        <br></br>
        <p> Define the new size of your image using: </p>
        <img src="" id="resizedImgPreview" alt="" />
        <button style={styles.button} onClick={handleSubmit}>Submit</button>
        <h2>Download Image</h2>
        <p>Download <a id="download-link" href="http://example.com">link</a> <br></br><span>Note: The download link will expire in certain period.</span></p>
      </div>
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { cursor: 'pointer', backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App