function updateTimes()
{
  setInterval(function(){
    nodes = document.querySelectorAll('.timeago');
    nodes.forEach(function(node) {
      var date = node.getAttribute('datetime');
      var insideLink = node.querySelector('a');
      if (insideLink === null) {
        nodeToReplace = node;
      } else {
        nodeToReplace = insideLink;
      }
      nodeToReplace.innerText = moment(date).fromNow();
    })
  }, 1000);
}
