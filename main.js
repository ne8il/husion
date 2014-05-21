var hs = {};

(function(){

  var colors = {
    'red' : {
      pastel_hue : '#F7977A',
      hue : '#FF4843',
      type : 'primary',
      combinations : {
        'blue' : 'purple',
        'yellow' : 'orange'
      }
    },
    'blue' : {
      pastel_hue : '#8493CA',
      hue : '#328BDC',
      type : 'primary',
      combinations : {
        'yellow' : 'green',
        'red' : 'purple'
      }
    },
    'yellow' : {
      pastel_hue : '#FFF79A',
      hue : '#FBFF93',
      type : 'primary',
      combinations : {
        'red' : 'orange',
        'blue' : 'green'
      }
    },
    'green' : {
      pastel_hue : '#82CA9D',
      hue : '#79C975',
      type : 'secondary'
    },
    'orange' : {
        pastel_hue :'#F9AD81',
        hue : '#FFBF43',
        type : 'secondary'
    },
    'purple' : {
      pastel_hue : '#A187BE',
      hue : '#6A3072',
      type : 'secondary'
    }
  };

  var colorArray = [];

  _.each(colors, function(value, key){
    if(value.type == 'primary'){
      colorArray.push.apply(colorArray, _.times(2, _.constant(value)));
    }else{
      colorArray.push(value);
    }
  });



  var firstSelected = false;


  var NUM_CELLS_PER_ROW = 5;
  var grid = [];

  var getRandomNum = function(num){
    return Math.floor(Math.random() * num);
  };

  var getRandomColor = function(){
    return colorArray[getRandomNum(colorArray.length)];
  };

  hs.setupGrid = function(){
      for(var i = 0; i < NUM_CELLS_PER_ROW; i++){
        grid[i] = [];
        for(var j = 0; j < NUM_CELLS_PER_ROW; j++){
            grid[i][j] = getRandomColor();
        }
      }
  }

  hs.drawGrid = function(){
    for(var i = 0; i < NUM_CELLS_PER_ROW; i++){
      grid[i] = [];
      for(var j = 0; j < NUM_CELLS_PER_ROW; j++){
          grid[i][j] = getRandomColor();
      }
    }
  }


  hs.fillGridWithColor = function(){
    $("li").each(function(index){
      $(this)
      .children("div.block")
      .css('background-color', function(blockIndex){
        return grid[index][blockIndex]['hue'];
      });
    });
  }

  hs.areBlocksContiguous = function(one, two){
    var sameParent = one.parent().is(two.parent());
    if(sameParent){
      return one.next().is(two) || one.prev().is(two);
    }else{
        var $rows = $('li');
        var oneIndex = one.parent().children().index(one);
        var twoIndex = two.parent().children().index(two);
        var rowsApart = Math.abs($rows.index(one.parent())
        - $rows.index(two.parent()));
        return oneIndex == twoIndex && rowsApart == 1;
    }
  }

  hs.handleClick = function(){
    if(!firstSelected){
        $("div.block").removeClass('first');
        $(this).addClass('first');
        firstSelected = true;
    }else{
      var $first = $("div.block.first"),
          $second = $(this);

      var areContig = hs.areBlocksContiguous($first, $second);
      console.log("are contig : " + areContig);
      if(areContig){
        hs.combine($first, $second);
      }else{
        //if not contig then reset first
        firstSelected = false;
        hs.handleClick.call(this);
      }
    }
  };

  hs.bindEvents = function(){
    $("div.block").on('click', hs.handleClick);
  };

  hs.combine = function($from, $to){


  };

}());

$().ready(function(){
  _.times(4, function(){
    $("ul").append($("ul li").first().clone());
  })

  hs.setupGrid();
  hs.drawGrid();
  hs.fillGridWithColor();
  hs.bindEvents();
});
