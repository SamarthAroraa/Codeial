class chatEngine {
  constructor(chatboxId, userEmail) {
    this.chatBox = $(`#${chatboxId}`);
    this.userEmail = userEmail;
    this.socket = io.connect("http://3.19.246.150:3002");
    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial",
      });
      self.socket.on("user_joined", function (data) {
      });
    });
    $(".message-submit").click(function () {
      let msg = $(".message-input").val();
      $(".message-input").val(null);

      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "codeial",
        });
      }
    });

    self.socket.on("recieve_message", function (data) {
      if (data.user_email != self.userEmail) {
        let avatar = data.sender.avatar
          ? data.sender.avatar
          : "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg";
        replyMessage(data.message, avatar, data.sender._id);
      }
    });
  }
}
