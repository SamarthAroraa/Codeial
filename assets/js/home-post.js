class ToggleLikes {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }
  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: "GET",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          let likeCount = parseInt($(self).attr("like-count"));
          if (data.data.deleted) {
            likeCount -= 1;
          } else {
            likeCount += 1;
          }
          $(self).attr("like-count", likeCount);
          if (likeCount == 1) {
            $(self).html(
              `<i class="fa fa-thumbs-up"></i>&nbsp;${likeCount} Like`
            );
          } else {
            $(self).html(
              `<i class="fa fa-thumbs-up"></i>&nbsp;${likeCount} Likes`
            );
          }
        })
        .fail(function (err) {
          console.log("Error in toggle likes ajax request", err);
        });
    });
  }
}

class PostComments {
  constructor(postId) {
    this.postId = postId;

    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    // console.log(this.postContainer, this.newCommentForm);

    this.createComment(postId);
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
          // $(`#post-comment-container-${postId}>.comment-form`).prepend(
          //   newComment
          // );
          $(newComment).insertBefore(
            $(`#post-comment-container-${postId}>.comment-form`)
          );
          pSelf.deleteComment($(".delete-comment-button", newComment));
          console.log(e.target.children[0], "72");
          e.target.children[0].value = "";
          new ToggleLikes($(" .toggle-like-button", newComment));

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
    return comment.user.avatar
      ? $(`
    <div class="social-comment" id="comment-${comment._id}">
  <a href="/users/profile/${comment.user._id}" class="pull-left">
    <img alt="image" src="${comment.user.avatar}" />
  </a>
  <div class="media-body">
    <a href="/users/profile/${comment.user._id}">
      ${comment.user.name}
    </a>
    ${comment.content}
    <br />
    <a
      class="toggle-like-button small"
      like-count="0"
      href="/likes/toggle/?id=${comment._id}&type=Comment"
      ><i class="fa fa-thumbs-up"></i> 0 Likes</a
    >

    <small class="text-muted"> -
      <a
        class="delete-comment-button"
        href="/comments/destroy/${comment._id}"
        >Delete</a
      >
      </small>
  </div>
</div>
    `)
      : $(`
    <div class="social-comment" id="comment-${comment._id}">
  <a href="/users/profile/${comment.user._id}" class="pull-left">
    <img alt="image" src="https://bootdey.com/img/Content/avatar/avatar1.png" />
  </a>
  <div class="media-body">
    <a href="/users/profile/${comment.user._id}">
      ${comment.user.name}
    </a>
    ${comment.content}
    <br />
    <a
      class="toggle-like-button small"
      like-count="0"
      href="/likes/toggle/?id=${comment._id}&type=Comment"
      ><i class="fa fa-thumbs-up"></i> 0 Likes</a
    >

    <small class="text-muted"> -
      <a
        class="delete-comment-button"
        href="/comments/destroy/${comment._id}"
        >Delete</a
      >
      </small>
  </div>
</div>
    `);
  }
  deleteComment(deleteLink) {
    $(deleteLink).click((e) => {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();
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
          deletePost($(" .delete-post-button", newPost));

          // console.log(data.data.post._id);
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          // console.log(newPost);
          $("#posts-list-container").prepend(newPost);
          new PostComments(data.data.post._id);
          new ToggleLikes($(" .toggle-like-button", newPost));

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
    let profile_pic = post.user.avatar
      ? `${post.user.avatar}`
      : "https://bootdey.com/img/Content/avatar/avatar1.png";

    return $(`<div class="social-feed-box" id="post-${post._id}">
    <div class="social-avatar">
      
      <a href="" class="pull-left">
        <img alt="image" src="${profile_pic}" />
      </a>
    
      
  
      <div class="media-body">
        <a href="/users/profile/${post.user._id}">
          ${post.user.name}
        </a>
        <small class="text-muted">Just Now</small>
      </div>
    </div>
    <div class="social-body">
      <p>
        ${post.content}
      </p>
  
      <div class="btn-group">
        <button class="btn btn-white btn-xs">
          <a
            class="toggle-like-button"
            href="/likes/toggle?id=${post._id}&type=Post"
            like-count="0"
          >
            <i class="fa fa-thumbs-up"></i>
            0 Likes
          </a>
          
        </button>
        
        <button class="btn btn-white btn-xs">
          <a class="delete-post-button" href="/posts/destroy/${post._id}"
            ><i class="fa fa-trash"></i
          ></a>
        </button>
        
      </div>
    </div>
  
    <div class="social-footer" id="post-comment-container-${post._id}">
      
      <div class="social-comment comment-form">
        <div class="media-body">
          <form
            action="/comments/create"
            method="POST"
            id="post-${post._id}-comments-form"
            class="comment-form"
          >
            <input
              type="text"
              class="form-control"
              name="content"
              placeholder="Write comment..."
              required
            />
            <input type="hidden" name="post" value="${post._id}" />
            <input type="submit" value="Comment" style="display: none;" />
          </form>
        </div>
      </div>
    </div>
  </div>
  
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
    console.log($("#posts-list-container>div"));
    $("#posts-list-container>div").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
      new ToggleLikes($(" .toggle-like-button", self));
    });
  };
  createPost();
  convertPostsToAjax();
}
