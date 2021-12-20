$(document).ready(() => {
    if(selectedTab === "followers") {
        loadFollowers()
    } else {
    loadFollowing();
    }
});

function loadFollowers() {
    $(document).ready(() => {
        $.get(`/api/users/${profileUserId}/followers`,(results ) => {
            outputUsers(results.followers,$(".resultsContainer"));
        })
    })
}

function loadFollowing() {
    $(document).ready(() => {
        $.get(`/api/users/${profileUserId}/following`, (results ) => {
            outputUsers(results.following,$(".resultsContainer"));
        })
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