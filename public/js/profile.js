$(document).ready(() => {
    loadPosts();
});

function loadPosts() {
    $(document).ready(() => {
        $.get("/api/posts", {postedBy: profileUserId},(results ) => {
            outputPosts(results,$(".postsContainer"));
        })
    })
}