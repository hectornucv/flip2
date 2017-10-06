var Configuration = {
  "badges": {
    "overwrite": false,
    "amount": null,
    "imageOn": null,
    "imageOff": null
  },
  "levels": [
    {
      "image": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/game_images/image1.jpg",
      "seconds": 20,
      "cols": 2,
      "rows": 2,
      "badges": {
        "imageOn": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/badges/medalon.png"
      }
    },
    {
      "random": false,
      "image": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/game_images/image2.jpg",
      "seconds": 60,
      "cols": 4,
      "rows": 4,
      "badges": {
        "imageOn": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/badges/medalon.png"
      }
    },
    {
      "random": false,
      "image": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/game_images/image3.jpg",
      "seconds": 30,
      "cols": 3,
      "rows": 3,
      "badges": {
        "imageOn": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/badges/medalon.png"
      }
    },
    {
      "image": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/game_images/image4.jpg",
      "seconds": 60,
      "cols": 3,
      "rows": 3,
      "badges": {
        "imageOn": "https://pagdig.blob.core.windows.net/assets/images/photoflip_test/badges/medalon.png"
      }
    }
  ]
};
var LEVELS = Configuration.levels;
var LevelsAnswered=0;

$(document).ready(function() {
	log('test');
	var dataFlip = {
        timer: {
            container: "#timer",
            seconds: LEVELS[LevelsAnswered].seconds,
            callback: function (ele) {
                $(".restart").show();
                $(".restart button").on("click", function () {
                    console.log("restarting");
                    $(ele).flip2win("restart");
                    $(".restart").hide();
                });
            }
        },
        cols: LEVELS[LevelsAnswered].cols,
        rows: LEVELS[LevelsAnswered].rows,
        width: 500,
        height: 500,
        onCompleted: newImage
    };
  $(".flip2win-puzzle").flip2win(dataFlip);

  

});
function resolveImage(LEVELS, IMAGES, data) {
    if (typeof LEVELS[LevelsAnswered].random === "undefined" || !LEVELS[LevelsAnswered].random) {
        data.image = LEVELS[LevelsAnswered].image;
    } else {
        var imagesNum = (IMAGES) ? IMAGES.length : 0;
        log("Images Length: " + imagesNum);
        if (!imagesNum) {
            console.log("Please add Images to the list in the game engine");
        } 
        var randomImage = Math.floor((Math.random() * imagesNum));
        log("random Image: " + randomImage);
        data.image = IMAGES[randomImage];
    }
    
}
function newImage() {
    getNextQuestion();
    LevelsAnswered++;
    $("#badges").badgesR8("add");
    if (LevelsAnswered < levelNum) {
        $(".next").show();
        $(".next button").on("click", function () {
            console.log("Next click");
            
            log("LEVELS[LevelsAnswered].random: " + LEVELS[LevelsAnswered].random);
            var data = {
                timer: { seconds: LEVELS[LevelsAnswered].seconds },
                cols: LEVELS[LevelsAnswered].cols,
                rows: LEVELS[LevelsAnswered].rows,
            }
          
            resolveImage(LEVELS, IMAGES, data);
            log(data);
            $(".flip2win-puzzle").flip2win("update", data);
            $(".next").hide();
        });
    } else {
        log("End Of the Game");
        finishGame();
        gotoResultPage();
    }
	 
}