
    var container = document.getElementById("container");
    var activeItem = null;

    var active = false;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    socket = io.connect('localhost:3000');

    // We make a named event called 'mouse' and write an
    // anonymous callback function
    socket.on('move',
    // When we receive data
        function(data) {
        console.log("Got: " + data.x + " " + data.y);
        setTranslateById(data.x, data.y, data.itemID)
        }
    );

    function dragStart(e) {

      if (e.target !== e.currentTarget) {
        active = true;

        // this is the item we are interacting with
        activeItem = e.target;

        if (activeItem !== null) {
          if (!activeItem.xOffset) {
            activeItem.xOffset = 0;
          }

          if (!activeItem.yOffset) {
            activeItem.yOffset = 0;
          }

          if (e.type === "touchstart") {
            activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
            activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
          } else {
            console.log("doing something!");
            activeItem.initialX = e.clientX - activeItem.xOffset;
            activeItem.initialY = e.clientY - activeItem.yOffset;
          }
        }
      }
    }

    function dragEnd(e) {
      if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
      }

      active = false;
      activeItem = null;
    }

    function drag(e) {
      if (active) {
        if (e.type === "touchmove") {
          e.preventDefault();

          activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
          activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
        } else {
          activeItem.currentX = e.clientX - activeItem.initialX;
          activeItem.currentY = e.clientY - activeItem.initialY;
        }

        activeItem.xOffset = activeItem.currentX;
        activeItem.yOffset = activeItem.currentY;

        setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
        sendActualMove(activeItem);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
    function setTranslateById(xPos, yPos, id){
        var el = document.getElementById(id);
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
    function setPositionById(xPos, yPos, id){
      var el = document.getElementById(id);
      el.style.position.left = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }

    function sendActualMove(actItem){
        // We are sending!
        console.log("move: " + actItem.currentX + " " + actItem.currentY);
    
        // Make a little object with  and y
        var data = {
            x: actItem.currentX,
            y: actItem.currentY,
            itemID: actItem.id
        };
  
        // Send that object to the socket
        socket.emit('move',data);
    }