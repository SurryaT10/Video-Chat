const videoGrid = document.querySelector("#video-grid");
console.log(videoGrid);
const video = document.createElement("video");
video.muted=false;

const mediaStream = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("canplay", () => {
        video.play();
    });

    videoGrid.append(video);
})