var connection;
window.onload = establishConnection();
function establishConnection(){
    window.WebSocket = window.WebSocket
    connection = new WebSocket('ws://127.0.0.1:8082');
}
connection.onopen = function () {
    console.log("connection is opened and ready to use");
  };
connection.onmessage = function (message){
    notifyMe(message.data);
    let ul = document.getElementById('notificationList');
    let li = document.createElement('li');
    li.innerHTML = message.data;
    ul.appendChild(li);
    console.log("Received By Browser: " + message.data);
}

function postMyMessage(){
    var desc = document.getElementById('desc');
    var msg = desc.value;
    desc.value = "";
    connection.send(msg);
}


function notifyMe(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/history', true);
xhr.send(null);
xhr.onreadystatechange = function () {//Call a function when the state changes.
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        var historyComments = xhr.response;
        console.log(historyComments);
        window.onload = function(){
            let allHistoryCommentsArray = historyComments.split(";");
            for(let i = 0; i < allHistoryCommentsArray.length; i++){
                var comment = allHistoryCommentsArray[i];
                if(comment){
                    let ul = document.getElementById('notificationList');
                    let li = document.createElement('li');
                    li.innerHTML = comment;
                    ul.appendChild(li); 
                }
            }
        }
    }
};
