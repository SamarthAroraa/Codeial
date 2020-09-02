var messages = $(".messages-content"),
  d,
  h,
  m,
  i = 0;
$(window).on("load", function () {
  messages.mCustomScrollbar();
});

function updateScrollbar() {
  messages.mCustomScrollbar("update").mCustomScrollbar("scrollTo", "bottom", {
    scrollInertia: 10,
    timeout: 0,
  });
}

function setDate() {
  d = new Date();
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ":" + m + "</div>").appendTo(
      $(".message:last")
    );
    $('<div class="checkmark-sent-delivered">&check;</div>').appendTo(
      $(".message:last")
    );
    $('<div class="checkmark-read">&check;</div>').appendTo($(".message:last"));
  }
}

function insertMessage() {
  msg = $(".message-input").val();

  if ($.trim(msg) == "") {
    return false;
  }
  $('<div class="message message-personal">' + msg + "</div>")
    .appendTo($(".mCSB_container"))
    .addClass("new");
  setDate();
  updateScrollbar();
  $(".message-input").val("");
}

// $(".message-submit").click(function () {
//   insertMessage();

// });

$("#chat-form").submit(function (e) {
  e.preventDefault();
  insertMessage();
  $(".messages-content").animate(
    { scrollTop: $(".messages-content")[0].scrollHeight + 50 },
    500
  );
});

// $(window).on("keydown", function (e) {
//   if (e.which == 13) {
//     insertMessage();
//     return false;
//   }
// });

function replyMessage(message, profile_pic, id) {
  if ($(".message-input").val() != "") {
    return false;
  }
  $(
    '<div class="message loading new"><figure class="avatar"><img src="http://askavenue.com/img/17.jpg" /></figure><span></span></div>'
  ).appendTo($(".mCSB_container"));
  updateScrollbar();

  setTimeout(function () {
    $(".message.loading").remove();
    $(
      '<div class="message new"><figure class="avatar"><a href="/users/profile/' +
        id +
        '" ><img src="' +
        profile_pic +
        '" /></a></figure>' +
        message +
        "</div>"
    )
      .appendTo($(".mCSB_container"))
      .addClass("new");
    setDate();
    updateScrollbar();
    $(".messages-content").animate(
      { scrollTop: $(".messages-content")[0].scrollHeight + 50 },
      500
    );
    i++;
  }, 1);
}

$(".button").click(function () {
  $(".menu .items span").toggleClass("active");
  $(".menu .button").toggleClass("active");
});

//cross chatbox
$(".chatbox-cross").click(function (e) {
  $(".avenue-messenger").css("display", "none");
});
