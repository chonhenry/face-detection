const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "627b9aa1d4774bc7a1d263c828bcb869"
});

// --------------------DOM--------------------
let btn = document.querySelector("button");
let img_link = document.querySelector("input");
let face_detection = document.querySelector(".faceDetection");

// --------------------function--------------------
let updateImg = e => {
  // Remove previous if any
  var delete_img = document.getElementById("detect_img");
  if (delete_img) {
    delete_img.remove();
  }

  // Update image
  img_to_insert = document.createElement("img");
  img_to_insert.setAttribute("src", img_link.value);
  img_to_insert.setAttribute("width", "500px");
  img_to_insert.setAttribute("height", "auto");
  img_to_insert.setAttribute("id", "detect_img");
  face_detection.appendChild(img_to_insert);

  // face detection
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, img_link.value)
    .then(response => {
      console.log(response);
    });

  // Add box
  box_to_add = document.createElement("div");
  box_to_add.setAttribute("id", "box");
  face_detection.appendChild(box_to_add);

  // Clear input
  img_link.value = "";
};

// --------------------Event Listeners--------------------
btn.addEventListener("click", updateImg);
