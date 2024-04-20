AFRAME.registerComponent("ball", {
  init: function () {
    this.throwBall();
  },
  throwBall: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "b") {
        var ball = document.createElement("a-entity");

        ball.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.5,
        });

        ball.setAttribute("material", "color", "blue");

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        ball.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");

        //set the ball as the dynamic entity
        ball.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });

        //add the collide event listener to the ball
        ball.addEventListener("collide", this.removeBall);

        scene.appendChild(ball);
      }
    });
  },
  removeBall: function (e) {
    //Original entity (ball)
    console.log(e.detail.target.el);

    //Other entity, which ball touched.
    console.log(e.detail.body.el);

    //ball element
    var element = e.detail.target.el;

    //element which is hit
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("target")) {
      elementHit.setAttribute("material", {
        opacity: 1,
        transparent: true,
      });

      //impulse and point vector
      var impulse = new CANNON.Vec3(-2, 2, 1);
      var worldPoint = new CANNON.Vec3().copy(
        elementHit.getAttribute("position")
      );

      elementHit.body.applyImpulse(impulse, worldPoint);

      //remove event listener
      element.removeEventListener("collide", this.shoot);

      //remove the balls from the scene
      var scene = document.querySelector("#scene");
      scene.removeChild(element);
    }
  },
});
