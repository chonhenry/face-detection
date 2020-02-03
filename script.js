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
  let boxEdge = { top_row: [], bottom_row: [], left_col: [], right_col: [] };
  let faceNum;

  // Remove previous image if any
  let delete_img = document.getElementById("detect_img");
  if (delete_img) {
    delete_img.remove();
  }

  // Remove boxes image if any
  let delete_box = document.querySelectorAll(".box");
  for (let i = 0; i < delete_box.length; i++) {
    let item = document.querySelector(".box");
    item.remove();
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
      console.log("response: ", response);
      faceNum = response.outputs[0].data.regions.length;

      for (let i = 0; i < faceNum; i++) {
        boxEdge.top_row.push(
          response.outputs[0].data.regions[i].region_info.bounding_box.top_row
        );
        boxEdge.bottom_row.push(
          response.outputs[0].data.regions[i].region_info.bounding_box
            .bottom_row
        );
        boxEdge.left_col.push(
          response.outputs[0].data.regions[i].region_info.bounding_box.left_col
        );
        boxEdge.right_col.push(
          response.outputs[0].data.regions[i].region_info.bounding_box.right_col
        );
      }
      console.log("boxEdge: ", boxEdge);
    })
    .then(() => {
      // Add box
      let img_height = document.getElementById("detect_img").height;
      let img_width = document.getElementById("detect_img").width;
      let topEdge, bottomEdge, leftEdge, rightEdge;

      for (let i = 0; i < faceNum; i++) {
        box_to_add = document.createElement("div");
        box_to_add.setAttribute("class", "box");

        topEdge = boxEdge.top_row[i] * img_height;
        bottomEdge = img_height - boxEdge.bottom_row[i] * img_height;
        leftEdge = img_width * boxEdge.left_col[i];
        rightEdge = img_width - boxEdge.right_col[i] * img_width;

        box_to_add.style = `top: ${topEdge}px; right: ${rightEdge}px; bottom: ${bottomEdge}px; left: ${leftEdge}px;`;
        face_detection.appendChild(box_to_add);
      }
    });

  // Clear input
  img_link.value = "";
};

// --------------------Event Listeners--------------------
btn.addEventListener("click", updateImg);
img_link.addEventListener("keypress", e => {
  if (event.which == 13 || event.keyCode == 13) {
    updateImg();
  }
});
