
// Ocular Motor Disorders
// Author: Andrew Jerrison
// 

var canvas;
var ctx;
var imgRightEye = new Image();
var imgLeftEye = new Image();
var img2eyes = new Image();
var imgCover = new Image();

var rightcentre_x = 125;
var rightcentre_y = 75;
var leftcentre_x = 375;
var leftcentre_y = 75;

var defaultvert = 30;
var defaulthoriz = 50;

var eyeoffset_x = 50;
var eyeoffset_y = 50;

var opaque_cover = true;
var fourth_cran = false;
var third_cran = false;

var left_eye = 
{
    max_left: 50,
    max_right: 50,
    max_up: 30,
    max_down: 30,
    centre_x: 375,
    centre_y: 75,
    mid_x: 375,
    mid_y: 75,
    xFrom: 375,
    xTo: 345,
    xNow: 375,
    covered: false,
    uncovered: true,
    yFrom: 75,
    yTo: 55,
    yNow: 75
};

var right_eye = 
{
    max_left: 50,
    max_right: 50,
    max_up: 30,
    max_down: 30,
    centre_x: 125,
    centre_y: 75,
    mid_x: 125,
    mid_y: 75,
    xFrom: 125,
    xTo: 95,
    xNow: 125,
    covered: false,
    uncovered: true,
    yFrom: 75,
    yTo: 55,
    yNow: 75
};


window.onresize = function (event) {
    applyOrientation();
}

function applyOrientation() {
    if (window.innerHeight > window.innerWidth && window.innerWidth < 520) {
       // alert("You are now in portrait");
        $("#orientation_special").show();
    } else {
       // alert("You are now in landscape");
        $("#orientation_special").hide();
    }
}


$(document).ready(function() {

    $('#portfolio_menu').removeClass('menu_link').addClass('menu_link_active');

    $('#oc_movement').prop("checked", false);
    $('#oc_cover').prop("checked", false);
    $('#oc_phoria').prop("checked", false);
    $('#oc_3step').prop("checked", false);
    $('#spacer_select').show();
    $('#spacer_special').show();
    $('#spacer_detail').show();
    applyOrientation();

    var eye_follow_allowed = true;
    canvas = document.getElementById("eyeCanvas"); // Find the canvas
    ctx = canvas.getContext("2d"); // Get the graphics context from the canvas


    load_eyes(centre_eyes); // Load the images
    reset_eyes();



    $('.btnCover').click(function() {
        if ($(this).val() == "Translucent cover") {

            $(this).val("Opaque cover");
            opaque_cover = false;
            change_cover();

        }
        else {
            $(this).val("Translucent cover");
            opaque_cover = true;
            change_cover();

        }

    });



    $('#eyeCanvas').on("vmouseover", function (kmouse) {
        //e.preventDefault();
        canvas_move(kmouse, eye_follow_allowed);
        
    });

    $('#eyeCanvas').on("vmousemove", function (kmouse) {
        //e.preventDefault();
        canvas_move(kmouse, eye_follow_allowed);

    });

    $(".oc_button").hover(
        function() {
            $(this).css('cursor', 'pointer');
        },
        function() {
            $(this).css('cursor', 'default');
        }
    );

    $('#oc_cover').click(function() {
        main_menu_click();
        $(this).removeClass("oc_button").addClass("oc_button_selected");
        reset_eyes();
        $('#cover_select').fadeIn(1000);
        $('#spacer_special').show();
        eye_follow_allowed = false;
        $('#cov_pref').prop("checked", true); // Initial is the Esotropia
        esotropia_preferential();
    });

    $('#oc_movement').click(function() {
        main_menu_click();
        $(this).removeClass("oc_button").addClass("oc_button_selected");
        reset_eyes();
        $('#movement_select').fadeIn(1000);
        $('#spacer_special').show();
        $('#mov_third').prop("checked", true); // Initial is the 3rd Cranial
        eye_follow_allowed = true;
        third_cranial();

    });

    $('#oc_phoria').click(function() {
        main_menu_click();
        $(this).removeClass("oc_button").addClass("oc_button_selected");
        reset_eyes();
        $('#phoria_select').fadeIn(1000);
        $('#spacer_special').show();
        $('#pho_exo').prop("checked", true); // Initial is the Exophoria
        eye_follow_allowed = false;
        exophoria();
    });

    $('#oc_3step').click(function() {
        main_menu_click();
        $(this).removeClass("oc_button").addClass("oc_button_selected");
        reset_eyes();
        $('#3step_select').fadeIn(1000);
        $('#3step_special').fadeIn(1000);
        eye_follow_allowed = false;
        $('#3step_one').prop("checked", true); // Initial is the Step 1
        stepone();
    });



    $("input[name='movtype']").change(function() {

        $('.mov_detail').hide();
        fourth_cran = false;
        third_cran = false;

        if ($('#mov_third').prop("checked") == true) {

            third_cranial();
        }

        if ($('#mov_sixth').prop("checked") == true) {
            sixth_cranial();
        }

        if ($('#mov_fourth').prop("checked") == true) {
            fourth_cranial();
        }

        if ($('#mov_orbital').prop("checked") == true) {
            orbital_move();
        }
    });

    $("input[name='3steptype']").change(function() {

        $('.threestep_detail').hide();
        $('#eyeCanvas').unbind('rightEyeCoveredEvent');
        $('#eyeCanvas').unbind('rightEyeUncoveredEvent');
        $('#eyeCanvas').unbind('leftEyeCoveredEvent');
        $('#eyeCanvas').unbind('leftEyeUncoveredEvent');


        if ($('#3step_one').prop("checked") == true) {

            stepone();
        }

        if ($('#3step_twoA').prop("checked") == true) {
            steptwoA();
        }

        if ($('#3step_twoB').prop("checked") ==true) {
            steptwoB();
        }

        if ($('#3step_threeA').prop("checked") == true) {
            stepthreeA();
        }

        if ($('#3step_threeB').prop("checked") == true) {
            stepthreeB();
        }
    });

    $("input[name='photype']").change(function() {

        $('.pho_detail').hide();
        $('#eyeCanvas').unbind('rightEyeCoveredEvent');
        $('#eyeCanvas').unbind('rightEyeUncoveredEvent');
        $('#eyeCanvas').unbind('leftEyeCoveredEvent');
        $('#eyeCanvas').unbind('leftEyeUncoveredEvent');

        if ($('#pho_exo').prop("checked") == true) {

            exophoria();
        }

        if ($('#pho_eso').prop("checked") == true) {

            esophoria();
        }

        if ($('#pho_vert').prop("checked") == true) {
            dissociated_vertical();
        }

        if ($('#pho_hyper').prop("checked") == true) {
            hyperphoria();
        }

    });


    $("input[name='covtype']").change(function() {

        $('.cov_detail').hide();
        $('#eyeCanvas').unbind('rightEyeCoveredEvent');
        $('#eyeCanvas').unbind('rightEyeUncoveredEvent');
        $('#eyeCanvas').unbind('leftEyeCoveredEvent');
        $('#eyeCanvas').unbind('leftEyeUncoveredEvent');

        if ($('#cov_eso').prop("checked") == true) {

            esotropia();
        }

        if ($('#cov_exo').prop("checked") == true) {
            exotropia();
        }

        if ($('#cov_pref').prop("checked") == true) {
            esotropia_preferential();
        }

        if ($('#cov_exo_left').prop("checked") == true) {
            exotropia_left();
        }


        if ($('#cov_hyper').prop("checked") == true) {
            hypertropia(false, 20, 0, true);
        }

    });


});

function canvas_move(kmouse, eye_follow_allowed) {
    if (eye_follow_allowed == true) {
        canoffset = $('#eyeCanvas').offset(); // Get the canvas offset
        draw_eyes(kmouse.pageX - Math.floor(canoffset.left), kmouse.pageY - Math.floor(canoffset.top));
    }
    else {
        if (animation_running == false) {
            canoffset = $('#eyeCanvas').offset(); // Get the canvas offset

            var xpos = kmouse.pageX - Math.floor(canoffset.left);
            if (xpos <= 200) {
                //draw_cover(false);
                $("#eyeCanvas").trigger("rightEyeCoveredEvent");
                $("#eyeCanvas").trigger("leftEyeUncoveredEvent");
            }
            else if (xpos >= 300) {
                //draw_cover(true);

                $("#eyeCanvas").trigger("leftEyeCoveredEvent").trigger("rightEyeUncoveredEvent");
                //$("#eyeCanvas").trigger("rightEyeUncoveredEvent");
            }
            else {
                //centre_eyes();
                $("#eyeCanvas").trigger("rightEyeUncoveredEvent");
                $("#eyeCanvas").trigger("leftEyeUncoveredEvent");
            }
        }
    }
}

function main_menu_click() {
    $('#movement_select').hide();
    $('#phoria_select').hide();
    $('#cover_select').hide();
    $('#3step_select').hide();
    $('#spacer_select').hide();
    $('#spacer_special').hide();
    $('#3step_special').hide();
    $('.mov_detail').hide();
    $('.pho_detail').hide();
    $('.cov_detail').hide();
    $('.threestep_detail').hide();
    $('#eyeCanvas').unbind('rightEyeCoveredEvent');
    $('#eyeCanvas').unbind('rightEyeUncoveredEvent');
    $('#eyeCanvas').unbind('leftEyeCoveredEvent');
    $('#eyeCanvas').unbind('leftEyeUncoveredEvent');
    fourth_cran = false;
    third_cran = false;

    if ($("#oc_cover").hasClass("oc_button_selected")) {
        $("#oc_cover").removeClass("oc_button_selected").addClass("oc_button");
    }
    if ($("#oc_phoria").hasClass("oc_button_selected")) {
        $("#oc_phoria").removeClass("oc_button_selected").addClass("oc_button");
    }
    if ($("#oc_movement").hasClass("oc_button_selected")) {
        $("#oc_movement").removeClass("oc_button_selected").addClass("oc_button");
    }
    if ($("#oc_3step").hasClass("oc_button_selected")) {
        $("#oc_3step").removeClass("oc_button_selected").addClass("oc_button");
    }
}

function animate_right_eye_x() {

    if (right_eye.xNow == right_eye.xTo) {
        animation_running = false;
        return;
    }

    if (right_eye.xFrom > right_eye.xTo) {
        right_eye.xNow--;
        draw_right_eye(right_eye.xNow, right_eye.centre_y);
        var t = setTimeout("animate_right_eye_x()", 5);
    }

    else {
        right_eye.xNow++;
        draw_right_eye(right_eye.xNow, right_eye.centre_y);
        var t = setTimeout("animate_right_eye_x()", 5);
    }
}

function animate_right_eye_y() {

    if (right_eye.yNow == right_eye.yTo) {
        animation_running = false;
        return;
    }

    if (right_eye.yFrom > right_eye.yTo) {
        right_eye.yNow--;
        draw_right_eye(right_eye.centre_x, right_eye.yNow);
        var t = setTimeout("animate_right_eye_y()", 5);
    }

    else {
        right_eye.yNow++;
        draw_right_eye(right_eye.centre_x, right_eye.yNow);
        var t = setTimeout("animate_right_eye_y()", 5);
        
    }
}



function animate_left_eye_x() {

    if (left_eye.xNow == left_eye.xTo) {
        animation_running = false;
        return;
    }

    if (left_eye.xFrom > left_eye.xTo) {
        left_eye.xNow--;
        draw_left_eye(left_eye.xNow, left_eye.centre_y);
        var t = setTimeout("animate_left_eye_x()", 5);
    }

    else {
        left_eye.xNow++;
        draw_left_eye(left_eye.xNow, left_eye.centre_y);
        var t = setTimeout("animate_left_eye_x()", 5);
        
    }
}

function animate_left_eye_y() {

    if (left_eye.yNow == left_eye.yTo) {
        animation_running = false;
        return;
    }

    if (left_eye.yFrom > left_eye.yTo) {
        left_eye.yNow--;
        draw_left_eye(left_eye.centre_x, left_eye.yNow);
        var t = setTimeout("animate_left_eye_y()", 5);
    }

    else {
        left_eye.yNow++;
        draw_left_eye(left_eye.centre_x, left_eye.yNow);
        var t = setTimeout("animate_left_eye_y()", 5);
        
    }
}



function draw_right_eye(x, y) {
    ctx.clearRect(0, 0, 500, 150);
    ctx.drawImage(imgRightEye, x-eyeoffset_x, y-eyeoffset_y);
    ctx.drawImage(imgLeftEye, left_eye.xNow-eyeoffset_x, left_eye.yNow-eyeoffset_y);
    ctx.drawImage(img2eyes, 0, 0);
    if (right_eye.covered == true) {
        ctx.drawImage(imgCover, 50, 0);
    }
    if (left_eye.covered == true) {
        ctx.drawImage(imgCover, 300, 0);
    }
    ctx.font = "10pt Calibri";
    ctx.fillText("+", 250, 75);
}

function draw_left_eye(x, y) {
    ctx.clearRect(0, 0, 500, 150);
    ctx.drawImage(imgRightEye, right_eye.xNow - eyeoffset_x, right_eye.yNow - eyeoffset_y);
    ctx.drawImage(imgLeftEye, x - eyeoffset_x, y - eyeoffset_y);
    ctx.drawImage(img2eyes, 0, 0);
    if (left_eye.covered == true) {
        ctx.drawImage(imgCover, 300, 0);
    }
    if (right_eye.covered == true) {
        ctx.drawImage(imgCover, 50, 0);
    }
    ctx.font = "10pt Calibri";
    ctx.fillText("+", 250, 75);
}



var animation_running = false;

// Dissociated vertical deviation
function dissociated_vertical() {
    reset_eyes();
    $('#pho_vert_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;
            right_eye.yFrom = right_eye.centre_y;
            right_eye.yTo = right_eye.centre_y - 20;
            right_eye.yNow = right_eye.centre_y;

            animation_running = true;
            animate_right_eye_y();
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            right_eye.yFrom = right_eye.centre_y - 20;
            right_eye.yTo = right_eye.centre_y;
            right_eye.yNow = right_eye.centre_y - 20;

            animation_running = true;
            animate_right_eye_y();
        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;
            left_eye.yFrom = left_eye.centre_y;
            left_eye.yTo = left_eye.centre_y - 20;
            left_eye.yNow = left_eye.centre_y;

            animation_running = true;
            animate_left_eye_y();
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            left_eye.yFrom = left_eye.centre_y -20;
            left_eye.yTo = left_eye.centre_y;
            left_eye.yNow = left_eye.centre_y - 20;

            animation_running = true;
            animate_left_eye_y();
        }

    });

}

// Esophoria
function esophoria() {
    reset_eyes();
    $('#pho_eso_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;
            right_eye.xFrom = right_eye.centre_x;
            right_eye.xTo = right_eye.centre_x + 30;
            right_eye.xNow = right_eye.centre_x;

            animation_running = true;
            animate_right_eye_x();
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            right_eye.xFrom = right_eye.centre_x + 30;
            right_eye.xTo = right_eye.centre_x;
            right_eye.xNow = right_eye.centre_x + 30;

            animation_running = true;
            animate_right_eye_x();
        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;
            left_eye.xFrom = left_eye.centre_x;
            left_eye.xTo = left_eye.centre_x - 30;
            left_eye.xNow = left_eye.centre_x;

            animation_running = true;
            animate_left_eye_x();
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            left_eye.xFrom = left_eye.centre_x - 30;
            left_eye.xTo = left_eye.centre_x;
            left_eye.xNow = left_eye.centre_x - 30;

            animation_running = true;
            animate_left_eye_x();
        }

    });
}

// Exophoria
function exophoria() {
    reset_eyes();
    $('#pho_exo_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;
            right_eye.xFrom = right_eye.centre_x;
            right_eye.xTo = right_eye.centre_x - 30;
            right_eye.xNow = right_eye.centre_x;

            animation_running = true;
            animate_right_eye_x();
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            right_eye.xFrom = right_eye.centre_x - 30;
            right_eye.xTo = right_eye.centre_x;
            right_eye.xNow = right_eye.centre_x -30;

            animation_running = true;
            animate_right_eye_x();
        }
    
    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;
            left_eye.xFrom = left_eye.centre_x;
            left_eye.xTo = left_eye.centre_x + 30;
            left_eye.xNow = left_eye.centre_x;

            animation_running = true;
            animate_left_eye_x();
        }
        

    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            left_eye.xFrom = left_eye.centre_x + 30;
            left_eye.xTo = left_eye.centre_x;
            left_eye.xNow = left_eye.centre_x + 30;

            animation_running = true;
            animate_left_eye_x();
        }
    
    });
}


// Hyperphoria
function hyperphoria() {
    reset_eyes();
    $('#pho_hyper_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;
            right_eye.yFrom = right_eye.centre_y;
            right_eye.yTo = right_eye.centre_y - 30;
            right_eye.yNow = right_eye.centre_y;

            animation_running = true;
            animate_right_eye_y();
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            right_eye.yFrom = right_eye.centre_y - 30;
            right_eye.yTo = right_eye.centre_y;
            right_eye.yNow = right_eye.centre_y - 30;

            animation_running = true;
            animate_right_eye_y();
        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;
            left_eye.yFrom = left_eye.centre_y;
            left_eye.yTo = left_eye.centre_y + 30;
            left_eye.yNow = left_eye.centre_y;

            animation_running = true;
            animate_left_eye_y();
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            left_eye.yFrom = left_eye.centre_y + 30;
            left_eye.yTo = left_eye.centre_y;
            left_eye.yNow = left_eye.centre_y + 30;

            animation_running = true;
            animate_left_eye_y();
        }

    });
}

// Esotropia
function esotropia() {
    reset_eyes();
    left_eye.centre_x = left_eye.centre_x - 20;
    centre_eyes();
    $('#cov_eso_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;

            if (right_eye.centre_x == right_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x + 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x + 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x + 20;
                right_eye.centre_x = right_eye.centre_x + 20;

                animation_running = true;
                animate_right_eye_x();
                animate_left_eye_x();
            }
            else
                draw_right_eye(right_eye.centre_x, right_eye.centre_y);
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            draw_right_eye(right_eye.centre_x, right_eye.centre_y);
            //animation_running = true;
        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;

            if (left_eye.centre_x == left_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x - 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x - 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x - 20;
                right_eye.centre_x = right_eye.centre_x - 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            draw_left_eye(left_eye.centre_x, left_eye.centre_y);
           //animation_running = true;
        }

    });
}


// Exotropia
function exotropia() {
    reset_eyes();
    right_eye.centre_x = right_eye.centre_x - 20;
    centre_eyes();
    $('#cov_exo_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;

            if (right_eye.centre_x == right_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x - 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x - 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x - 20;
                right_eye.centre_x = right_eye.centre_x - 20;

                animation_running = true;
                animate_right_eye_x();
                animate_left_eye_x();
            }
            else
                draw_right_eye(right_eye.centre_x, right_eye.centre_y);
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            draw_right_eye(right_eye.centre_x, right_eye.centre_y);
           
        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;

            if (left_eye.centre_x == left_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x + 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x + 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x + 20;
                right_eye.centre_x = right_eye.centre_x + 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            draw_left_eye(left_eye.centre_x, left_eye.centre_y);
            
        }

    });
}

// Hypertropia
function hypertropia(from_3step, hyper_value, xoffset, left_hyper) {
    reset_eyes();
    left_eye.centre_y = left_eye.centre_y - hyper_value;
    left_eye.yNow = left_eye.centre_y;
    right_eye.centre_x = right_eye.centre_x + xoffset;
    right_eye.xNow = right_eye.centre_x;
    left_eye.centre_x = left_eye.centre_x + xoffset;
    left_eye.xNow = left_eye.centre_x;
    centre_eyes();
    if (from_3step == false) {
    
        $('#cov_hyper_detail').fadeIn(1000);
    }
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;

            if (right_eye.centre_y == right_eye.mid_y) {
                right_eye.yFrom = right_eye.centre_y;
                right_eye.yTo = right_eye.centre_y + hyper_value;
                right_eye.yNow = right_eye.centre_y;
                left_eye.yFrom = left_eye.centre_y;
                left_eye.yTo = left_eye.centre_y + hyper_value;
                left_eye.yNow = left_eye.centre_y;

                left_eye.centre_y = left_eye.centre_y + hyper_value;
                right_eye.centre_y = right_eye.centre_y + hyper_value;

                animation_running = true;
                animate_right_eye_y();
                animate_left_eye_y();
            }
            else
                draw_right_eye(right_eye.centre_x, right_eye.centre_y);
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;

            if (left_hyper == true) {
                if (left_eye.centre_y == left_eye.mid_y) {
                    right_eye.yFrom = right_eye.centre_y;
                    right_eye.yTo = right_eye.centre_y - hyper_value;
                    right_eye.yNow = right_eye.centre_y;
                    left_eye.yFrom = left_eye.centre_y;
                    left_eye.yTo = left_eye.centre_y - hyper_value;
                    left_eye.yNow = left_eye.centre_y;

                    left_eye.centre_y = left_eye.centre_y - hyper_value;
                    right_eye.centre_y = right_eye.centre_y - hyper_value;

                    animation_running = true;
                    animate_right_eye_y();
                    animate_left_eye_y();
                }
                else
                    draw_left_eye(left_eye.centre_x, left_eye.centre_y);
            
            }
            else {
            
                draw_right_eye(right_eye.centre_x, right_eye.centre_y);
            }

        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;

            if (left_hyper == false) {
                if (left_eye.centre_y == left_eye.mid_y) {
                    right_eye.yFrom = right_eye.centre_y;
                    right_eye.yTo = right_eye.centre_y - hyper_value;
                    right_eye.yNow = right_eye.centre_y;
                    left_eye.yFrom = left_eye.centre_y;
                    left_eye.yTo = left_eye.centre_y - hyper_value;
                    left_eye.yNow = left_eye.centre_y;

                    left_eye.centre_y = left_eye.centre_y - hyper_value;
                    right_eye.centre_y = right_eye.centre_y - hyper_value;

                    animation_running = true;
                    animate_right_eye_y();
                    animate_left_eye_y();
                }
                else
                    draw_left_eye(left_eye.centre_x, left_eye.centre_y);
            }
            else {
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);
            }
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            draw_left_eye(left_eye.centre_x, left_eye.centre_y);

        }

    });
}

// 3 step: step 1. 
// Do straight gaze hypertropia
function stepone() {
    $('#3step_one_detail').fadeIn(1000);
    hypertropia(true, 20, 0, false);
}

// 3 step: step 2a. 
// Do right gaze hypertropia
function steptwoA() {
   
    $('#3step_twoA_detail').fadeIn(1000);
    hypertropia(true, 20, -40, false);
}

// 3 step: step 2b. 
// Do left gaze hypertropia
function steptwoB() {

    $('#3step_twoB_detail').fadeIn(1000);
    hypertropia(true, 10, 40, false);
}

// 3 step: step 3a. 
// Do right tilt hypertropia
function stepthreeA() {

    $('#3step_threeA_detail').fadeIn(1000);
    hypertropia(true, 10, 0, false);
}

// 3 step: step 3b. 
// Do left tilt hypertropia
function stepthreeB() {
    $('#3step_threeB_detail').fadeIn(1000);
    hypertropia(true, 20, 0, false);
}



// Right Esotropia with preferential fixation
function esotropia_preferential() {
    reset_eyes();
    right_eye.centre_x = right_eye.centre_x + 20;
    centre_eyes();
    $('#cov_pref_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;

            draw_right_eye(right_eye.centre_x, right_eye.centre_y);
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            draw_right_eye(right_eye.centre_x, right_eye.centre_y);

        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;

            if (left_eye.centre_x == left_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x - 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x - 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x - 20;
                right_eye.centre_x = right_eye.centre_x - 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            if (right_eye.centre_x == right_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x + 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x + 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x + 20;
                right_eye.centre_x = right_eye.centre_x + 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);

        }

    });
}


// Left Exotropia
function exotropia_left() {
    reset_eyes();
    left_eye.centre_x = left_eye.centre_x + 20;
    centre_eyes();
    $('#cov_exo_left_detail').fadeIn(1000);
    $("#eyeCanvas").bind("rightEyeCoveredEvent", function(event) {
        right_eye.uncovered = false;
        if (right_eye.covered == false) {
            right_eye.covered = true;
            if (right_eye.centre_x == right_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x - 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x - 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x - 20;
                right_eye.centre_x = right_eye.centre_x - 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
            draw_right_eye(right_eye.centre_x, right_eye.centre_y);
        }
    });
    $("#eyeCanvas").bind("rightEyeUncoveredEvent", function(event) {
        right_eye.covered = false;
        if (right_eye.uncovered == false) {
            right_eye.uncovered = true;
            if (left_eye.centre_x == left_eye.mid_x) {
                right_eye.xFrom = right_eye.centre_x;
                right_eye.xTo = right_eye.centre_x + 20;
                right_eye.xNow = right_eye.centre_x;
                left_eye.xFrom = left_eye.centre_x;
                left_eye.xTo = left_eye.centre_x + 20;
                left_eye.xNow = left_eye.centre_x;

                left_eye.centre_x = left_eye.centre_x + 20;
                right_eye.centre_x = right_eye.centre_x + 20;

                animation_running = true;
                animate_left_eye_x();
                animate_right_eye_x();
            }
            else
            draw_right_eye(right_eye.centre_x, right_eye.centre_y);

        }

    });
    $("#eyeCanvas").bind("leftEyeCoveredEvent", function(event) {
        left_eye.uncovered = false;
        if (left_eye.covered == false) {
            left_eye.covered = true;

            
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);
        }


    });
    $("#eyeCanvas").bind("leftEyeUncoveredEvent", function(event) {
        left_eye.covered = false;
        if (left_eye.uncovered == false) {
            left_eye.uncovered = true;
            
                draw_left_eye(left_eye.centre_x, left_eye.centre_y);

        }

    });
}



// Third Cranial Nerve Palsy
function third_cranial() {
    reset_eyes();
    third_cran = true;
    $('#mov_third_detail').fadeIn(1000);
    // 'fixation' is slightly left and down ( from the user's point of view)
    right_eye.centre_x = right_eye.centre_x - 10;
    right_eye.centre_y = right_eye.centre_y + 10;
    right_eye.max_up = 10;
    right_eye.max_right = 10;
    right_eye.max_down = 10;
    right_eye.max_left = 40;
    centre_eyes();
}

// Sixth Cranial Nerve Palsy
function sixth_cranial() {
    reset_eyes();
    $('#mov_sixth_detail').fadeIn(1000);
    // 'fixation' is slightly left  ( from the user's point of view)
    left_eye.centre_x = left_eye.centre_x - 20;

    left_eye.max_left = 30;
    left_eye.max_right = 20;
    centre_eyes();
}

// Fourth Cranial Nerve Palsy
function fourth_cranial() {
    reset_eyes();
    $('#mov_fourth_detail').fadeIn(1000);
    // 'fixation' is slightly up 
    //right_eye.centre_x = right_eye.centre_x - 10;
    right_eye.centre_y = right_eye.centre_y - 10;
    right_eye.max_up = 20;
   // right_eye.max_right = 10;
    right_eye.max_down = 20;
    fourth_cran = true;
    //right_eye.max_left = 40;
    centre_eyes();
}


// Orbital Floor Fracture with Inferior Rectus Entrapment
function orbital_move() {
    reset_eyes();
    $('#mov_orbital_detail').fadeIn(1000);
    // 'fixation' is slightly down  ( from the user's point of view)
    left_eye.centre_y = left_eye.centre_y + 10;
    left_eye.max_down = 20;
    left_eye.max_up = 0;

    centre_eyes();
}

function draw_cover(right) {
    centre_eyes();
    if (right == true) {
        ctx.drawImage(imgCover, 300, 0);
    }
    else {
        ctx.drawImage(imgCover, 50, 0);
    }
        
}

function change_cover() {
    var rootpath = "";
    if (window.location.host.indexOf("localhost") > -1) {
        rootpath = "/";
    }
    //else if (window.location.host.indexOf("personalpages") > -1) {
    //    rootpath = "/staff/Andrew.Jerrison/";
    //}

    if (opaque_cover == true) {
        imgCover.src = rootpath + "./Images/cover_opaque.png";
        
    }
    else {
        imgCover.src = rootpath + "./Images/cover.png";
    }

    imgCover.onload = function(){
        draw_left_eye(left_eye.centre_x, left_eye.centre_y);
        draw_right_eye(right_eye.centre_x, right_eye.centre_y);
    }
}

function load_eyes(callback) {
    var loadedImages = 0;

    var rootpath = "";
    if (window.location.host.indexOf("localhost") > -1) {
        rootpath = "/";
    }
    //else if (window.location.host.indexOf("personalpages") > -1) {
    //    rootpath = "/staff/Andrew.Jerrison/";
    //}
    
    imgCover.src = rootpath+ "./Images/cover_opaque.png";
    // Load the images into memory - should only need to do this once.
    // The handling is slightly clunky - I want to wait until all 3 images are
    // loaded before displaying the eyes. This might have been better done by
    // looping through an array of images, but I wanted to individually name the
    // variables for clarity.

    imgRightEye.src = rootpath+ "./Images/eyeball.png";
    imgRightEye.onload = function() {
        if (++loadedImages >= 3) {
            callback();
        }
    };
    imgLeftEye.src = rootpath + "./Images/eyeball.png";
    imgLeftEye.onload = function() {
        if (++loadedImages >= 3) {
            callback();
        }
    };
    img2eyes.src = rootpath +  "./Images/twoeyes.png";
    img2eyes.onload = function() {
        if (++loadedImages >= 3) {
            callback();
        }
    };

   
}

function centre_eyes() {
    // Move the eyes to their central positions
    ctx.clearRect(0, 0, 500, 150);
    check_right_eye_image(right_eye.centre_x - eyeoffset_x, right_eye.centre_y - eyeoffset_y);
    ctx.drawImage(imgRightEye, right_eye.centre_x-eyeoffset_x, right_eye.centre_y-eyeoffset_y);
    ctx.drawImage(imgLeftEye, left_eye.centre_x-eyeoffset_x, left_eye.centre_y-eyeoffset_y);
    ctx.drawImage(img2eyes, 0, 0);
    ctx.font = "10pt Calibri";
    ctx.fillText("+", 250, 75);
}

function reset_eyes() {
    centre_eyes();
    left_eye.centre_x = leftcentre_x;
    left_eye.centre_y = leftcentre_y;
    left_eye.max_down = defaultvert;
    left_eye.max_up = defaultvert;
    left_eye.max_left = defaulthoriz;
    left_eye.max_right = defaulthoriz;
    left_eye.xNow = left_eye.centre_x;
    left_eye.xFrom = left_eye.centre_x;
    left_eye.xTo = left_eye.centre_x;
    left_eye.yNow = left_eye.centre_y;
    left_eye.yFrom = left_eye.centre_y;
    left_eye.yTo = left_eye.centre_y;
    left_eye.uncovered = true;
    left_eye.covered = false;
    
    right_eye.centre_x = rightcentre_x;
    right_eye.centre_y = rightcentre_y;
    right_eye.max_down = defaultvert;
    right_eye.max_up = defaultvert;
    right_eye.max_left = defaulthoriz;
    right_eye.max_right = defaulthoriz;
    right_eye.xNow = right_eye.centre_x;
    right_eye.xFrom = right_eye.centre_x;
    right_eye.xTo = right_eye.centre_x;
    right_eye.yNow = right_eye.centre_y;
    right_eye.yFrom = right_eye.centre_y;
    right_eye.yTo = right_eye.centre_y;
    right_eye.uncovered = true;
    right_eye.covered = false;

    if (opaque_cover == true) {
        $('.btnCover').val("Translucent cover");
    }
    else {
        $('.btnCover').val("Opaque cover");
    }
}

function draw_eyes(mouse_x, mouse_y) {
    // Move the eyes to look towards the mouse pointer
    var right_x = calculate_right_x(mouse_x);
    var right_y = calculate_right_y(mouse_y, mouse_x);
    var left_x = calculate_left_x(mouse_x);
    var left_y = calculate_left_y(mouse_y);

    ctx.clearRect(0, 0, 500,150);
    
   
    check_right_eye_image(right_x, right_y);
    
    ctx.drawImage(imgRightEye, right_x, right_y);
    
    
    ctx.drawImage(imgLeftEye, left_x, left_y);
    ctx.drawImage(img2eyes, 0, 0);
    ctx.font = "10pt Calibri";
    ctx.fillText("+",250 , 75);
}

// If this is the 3rd cranial then the right eye has to be dilated
function check_right_eye_image() {
    var rootpath = "";
    if (window.location.host.indexOf("localhost") > -1) {
        rootpath = "/";
    }
    //else if (window.location.host.indexOf("personalpages") > -1) {
    //    rootpath = "/staff/Andrew.Jerrison/";
    //}

    if (third_cran == true) {


        if (imgRightEye.src.indexOf("dilated") == -1) {
            imgRightEye.src = rootpath + "./Images/eyeball_dilated.png";

        }

        imgCover.onload = function() {

            ctx.drawImage(imgRightEye, right_x, right_y);
        }
    }
    else {

        if (imgRightEye.src.indexOf("dilated") > -1) {
            imgRightEye.src = rootpath + "./Images/eyeball.png";

        }

        imgCover.onload = function() {

            ctx.drawImage(imgRightEye, right_x, right_y);
        }
    }
}

function calculate_right_x(mouse_x) {
    if (mouse_x > left_eye.mid_x) {
        // moving right (as the user sees it)
        if (mouse_x - left_eye.centre_x > right_eye.max_right)
            return right_eye.centre_x - eyeoffset_x + right_eye.max_right;
        else
            return right_eye.centre_x -eyeoffset_x + (mouse_x - left_eye.centre_x);
    }
    else if (mouse_x < right_eye.mid_x) {
        // moving left (as the user sees it)


        if (right_eye.centre_x - mouse_x < right_eye.max_left)
            return mouse_x-eyeoffset_x; 
        else
            return right_eye.centre_x - right_eye.max_left - eyeoffset_x; 
    }
    else {
        // straight ahead
        return right_eye.centre_x - eyeoffset_x;
    }
}

function calculate_right_y(mouse_y, mouse_x) {
    if (mouse_y > right_eye.mid_y && mouse_y > right_eye.centre_y) {
        if (fourth_cran == true && (mouse_x - right_eye.centre_x - eyeoffset_x) < 0) {
            right_eye.max_down = 40;
        }
        else if (fourth_cran == true){
        right_eye.max_down = 20;
        }
        
        // moving down (as the user sees it)
        if (mouse_y - right_eye.centre_y > right_eye.max_down)
            return right_eye.centre_y - eyeoffset_y + right_eye.max_down;
        else
            return right_eye.centre_y - eyeoffset_y + (mouse_y - right_eye.centre_y);
    }
    else if (mouse_y < right_eye.mid_y && mouse_y < right_eye.centre_y) {
        // moving up (as the user sees it)

        if (right_eye.centre_y - mouse_y > right_eye.max_up)
            return right_eye.centre_y - eyeoffset_y - right_eye.max_up;
        else
            return right_eye.centre_y - eyeoffset_y - (right_eye.centre_y - mouse_y);
    }
    else {
        // straight ahead
        return right_eye.centre_y - eyeoffset_y;
    }
}

function calculate_left_x(mouse_x) {
    if (mouse_x > left_eye.mid_x ) {
        // moving right (as the user sees it)
        if (mouse_x - left_eye.centre_x > left_eye.max_right)
            return left_eye.centre_x - eyeoffset_x + left_eye.max_right;
        else
            return left_eye.centre_x -eyeoffset_x + (mouse_x - left_eye.centre_x);
    }
    else if (mouse_x < right_eye.mid_x) {
        // moving left (as the user sees it)

    if (right_eye.centre_x - mouse_x < left_eye.max_left)
        return left_eye.centre_x - (right_eye.centre_x - mouse_x) - eyeoffset_x; //left_eye.centre_x - left_eye.max_left;
    else
        return left_eye.centre_x - left_eye.max_left - eyeoffset_x;// left_eye.centre_x - (right_eye.centre_x - mouse_x);
    }
    else {
        // straight ahead
        return left_eye.centre_x - eyeoffset_x;
    }
}

function calculate_left_y(mouse_y) {
    if (mouse_y > left_eye.mid_y && mouse_y > left_eye.centre_y) {
        // moving down (as the user sees it)
        if (mouse_y - left_eye.centre_y > left_eye.max_down)
            return left_eye.centre_y - eyeoffset_y + left_eye.max_down;
        else
            return left_eye.centre_y - eyeoffset_y + (mouse_y - left_eye.centre_y);
    }
    else if (mouse_y < left_eye.mid_y && mouse_y < left_eye.centre_y) {
        // moving up (as the user sees it)

        if (left_eye.centre_y - mouse_y > left_eye.max_up)
            return left_eye.centre_y - eyeoffset_y - left_eye.max_up;
        else
            return left_eye.centre_y - eyeoffset_y - (left_eye.centre_y - mouse_y);
    }
    else {
        // straight ahead
        return left_eye.centre_y - eyeoffset_y;
    }
}
