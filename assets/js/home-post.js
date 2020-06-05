class PostComments {
  constructor(postId) {
    this.postId = postId;

    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);
    console.log("ncf", this.newCommentForm);

    // console.log(this.postContainer, this.newCommentForm);

    this.createComment(postId);
    console.log(postId);
    let self = this;
    // console.log($(" .delete-comment-button", this.postContainer), "yy");

    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
      // console.log($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: "post",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          console.log("nc", $(`#post-comments-${postId}`));
          $(`#post-comment-container-${postId}`).prepend(newComment);
          pSelf.deleteComment($(".delete-comment-button", newComment));
          console.log(e.target.children[0]);
          e.target.children[0].value = "";
          new Noty({
            theme: "relax",
            text: "Comment Published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  newCommentDom(comment) {
    return $(`<li id="comment-${comment._id}">
      <p>
        ${comment.content}
        <br />
        <small>${comment.user.name}</small>
      </p>

      <a class="delete-comment-button" href="/comments/destroy/${comment._id}"
        >X</a
      >

    </li>`);
  }
  deleteComment(deleteLink) {
    $(deleteLink).click((e) => {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}

// module.exports = PostComments;

{
  //method to submit form data using ajax
  let createPost = async () => {
    let newPostForm = $("#new-post-form");
    // console.log(newPostForm);

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          console.log(data);
          let newPost = newPostDOM(data.data.post);
          // console.log(data.data.post);
          deletePost($(" .delete-post-button", newPost));
          // console.log(data.data.post._id);
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          console.log(newPost);
          $("#posts-list-container>ul").prepend(newPost);
          new PostComments(data.data.post._id);

          $("#textarea-np").val("");
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create post using ajax
  let newPostDOM = function (post) {
    return $(`<li id="post-${post._id}">
      <p> ${post.content} <br /><small> ${post.user.name}</small></p>
      <small>
        <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete</a>
      </small>
    
    
      <div class="post-container">
        <form action="/comments/create" method="POST"
        id="post-${post._id}-comments-form" class="comment-form">
          <input
            type="text"
            name="content"
            placeholder="Add a comment..."
            required
          />
          <input type="hidden" name="post" value="${post._id}" />
          <input type="submit" value="Comment" />
        </form>
    
        <div >
        <ul id="post-comment-container-${post._id}"></ul>
        </div>
      </div>
    </li>
    `);
  };

  //method to delete a post from DOM
  let deletePost = function (deleteLink) {
    deleteLink.click((e) => {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },

        error: {
          function(error) {
            console.log(error.responseText);
          },
        },
      });
    });
  };

  let convertPostsToAjax = function () {
    console.log($("#posts-list-container>ul>li"));
    $("#posts-list-container>ul>li").each(function () {
      console.log("uu");

      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };
  createPost();
  convertPostsToAjax();
}
