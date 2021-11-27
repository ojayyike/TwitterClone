$(document).ready(() => {
    $.get("/api/posts", (results ) => {
        //console.log(results);
        outputPosts(results,$(".postsContainer"));
    })
})
//const express = require('express');
function outputPosts(results,container) {
    container.html("");
    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    })

    if (results.length == 0) {
        container.append("<span class='noResults'>No Tweets to show</span>")
    }
}

