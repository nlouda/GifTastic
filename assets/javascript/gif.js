$(document).ready(function () {
    var gifCategories = ["puppies", "cats", "giraffe", "elephant"];

    function renderButtons() {
        $("#gif-display").empty();

        for (var i = 0; i < gifCategories.length; i++) {
            var b = $("<button>");
            b.addClass("category");
            b.attr("data-name", gifCategories[i]);
            b.text(gifCategories[i]);
            $("#gif-display").append(b);
        }
    }

    function addNewCategory() {
        $("#add-category").on("click", function (event) {
            event.preventDefault();
            var category = $("#new-gif").val().trim();
            if (category == "") {
                return false;
            }
            gifCategories.push(category);
            renderButtons();
            return false;
        });
    }

    function displayGifs() {
        var category = $(this).attr("data-name");

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +category+ "&api_key=dc6zaTOxFJmzC&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            console.log(response); //test
            $("#images-view").empty(); //empties image view div after every click
            var results = response.data;
            if (results == "") {
                alert("there is not a gif for button selected");
            }
            for (var i = 0; i < results.length; i++) {
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    var gifDiv = $("<div class='item'>");
                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating);
                    var image = $("<img>");
                    image.attr("src", results[i].images.fixed_height_small_still.url);
                    image.attr("data-still", results[i].images.fixed_height_small_still.url);
                    image.attr("data-animate", results[i].images.fixed_height_small.url);
                    image.attr("data-state", "still");

                    gifDiv.append(p);
                    gifDiv.append(image);
                    $("#images-view").prepend(gifDiv);
                }
            }

        });
    }
    renderButtons();
    addNewCategory();
    $(document).on("click", ".category", displayGifs);
    $(document).on("click", ".image", function() {
        var state = $(this).attr('data-state');
        if (state == 'still') {
            $(this).attr('src', $(this).data('animate'));
            $(this).attr('data-state', 'animate');
        } else {
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }

    });

})