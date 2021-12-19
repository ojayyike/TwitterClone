$(document).ready(() => {
    $.get("/api/posts/" + postId, (results ) => {
        //console.log(results);
        outputPostsWtihReplies(results,$(".postsContainer"));
    })
})
//const express = require('express');

