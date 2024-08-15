var postCount = 0;
var createText = document.querySelector(".create");

if (postCount === 0)
{
    createText.innerHTML = "Sorry you have no posts. Try creating one."
}
else {
    createText.innerHTML = "Check out your posts"
}