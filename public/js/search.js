var timer; 
$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();
    var searchType = textbox.data().search;
    timer = setTimeout(() => {
        value = textbox.val().trim();

        if(value == ""){
            $(".resultsContainer").html("");
        } else {
           search(value,searchType) 
        }
    }, 1000)
})

function search(searchTerm, searchType) {
    var url = searchType == "users" ? "/api/users" : "/api/posts"

    $.get(url, {search: searchTerm},(results) => {
        if(searchType == "users") {
            outputUsers(results,$(".resultsContainer"));
        } else {
            outputPosts(results, $(".resultsContainer"))
        }
    })
}

function outputUsers(results, container) {
    console.log("hi")
    if(results.length == 0) {
        container.append("<span class='noResults'>No Results found</span>")
        console.log("No users found")
    }
    results.forEach(result => {
        console.log(result.firstName)
        var html = createUserHTML(result,true)
        container.append(html)
    });
}
function createUserHTML(userData, showFollowButton) {
    var name = userData.firstName + " " + userData.lastName;
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow" 
    var  buttonClass = isFollowing ? "followButton following" : "followButton" 
    
    var followButton = "";
    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button> 
                        </div>`
    }
    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'> 
                </div> 
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>  
                 ${followButton}
            </div>`;
}

