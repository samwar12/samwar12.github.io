const socket = io('https://glacial-atoll-60287.herokuapp.com/');


$.ajax({
  url: "https://global.xirsys.net",
  data: {
    ident: "samwar11",
    secret: "bec4837c-40a6-11e9-a62a-0242ac110003",
    domain: "samwar12.github.io",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});


function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'intense-inlet-90456.herokuapp.com', 
    secure: true, 
    port: 9000,
  config: customConfig 
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
