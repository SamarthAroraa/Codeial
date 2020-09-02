class toggleRequest {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleRequest();
  }
  toggleRequest() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = $(this);

      let a_tag = self.children().first();
      $.ajax({
        type: "GET",
        url: $(a_tag).attr("href"),
      })
        .done(function (data) {
          // $(self).attr("like-count", likeCount);
          let array_url = $(a_tag).attr("href").split("/");
          let user_id = array_url[array_url.length - 1];
          if (data.data.code) {
            $(self).html(
              `<a
                href="/friends/remove/${user_id}"
                class="btn btn-sm btn-block btn-danger"
              >
                <i class="ace-icon fa fa-remove bigger-120"></i>
                <span class="bigger-110">Remove from friend list</span>
              </a>`
            );
            new Noty({
              theme: "relax",
              text: "Added to friend list",
              type: "success",
              layout: "topRight",
              timeout: 1500,
            }).show();
          } else {
            $(self).html(
              `<a
                href="/friends/add/${user_id}"
                class="btn btn-sm btn-block btn-success"
              >
                <i class="ace-icon fa fa-plus-circle bigger-120"></i>
                <span class="bigger-110">Add as a friend</span>
              </a>`
            );
            new Noty({
              theme: "relax",
              text: "Removed from friend list",
              type: "success",
              layout: "topRight",
              timeout: 1500,
            }).show();
          }
        })
        .fail(function (err) {
          console.log("Error in toggle request ajax request", err);
        });
    });
  }
}

let convertProfileToAjax = function () {
  const exec = function () {
    new toggleRequest($("#request-wrapper"));
  };

  exec();
};
convertProfileToAjax();
