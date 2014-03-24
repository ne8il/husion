var hs = {};

(function(){

  var colors = {
    'red' : '#F7977A',
    'blue' : '#8493CA',
    'green' : '#82CA9D',
    'yellow' : '#FFF79A',
    'orange' : '#F9AD81',
    'purple' : '#A187BE'
  };

  var firstSelected = false;

  console.log(colors);

  var NUM_CELLS_PER_ROW = 5;
  var grid = [];

  var getRandomNum = function(num){
    return Math.floor(Math.random() * num);
  };

  var getRandomColor = function(){
    var key = _.keys(colors)[getRandomNum(_.keys(colors).length)];
    return colors[key];
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
        return grid[index][blockIndex];
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

  hs.bindEvents = function(){
    $("div.block").on('click', function(e){
      if(!firstSelected){
          $("div.block").removeClass('first');
          $(this).addClass('first');
          firstSelected = true;
      }else{
        var areContig = hs.areBlocksContiguous($("div.block.first"), $(this));

        console.log("are contig : " + areContig);
      }
    });
  }
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
