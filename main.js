var hs = {};

jQuery.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};

// TODO : change to just put the class name of the color instead
// of the background color

//http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

(function(){

  var emptyColor = {
    'name' : null,
    'hue' : '#333'
  }

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

  var all_colors = _.keys(colors),
      all_color_classes = all_colors.join(' ');

  var colorArray = _.flatten(_.map(colors, function(value, key){
    value = _.extend(value, {'name' : key});

    if(value.type == 'primary'){
      return _.times(2, _.constant(value));
    }else{
      return [value];
    }
  }));

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
      .each(function(blockIndex){
        hs.colorCell($(this), grid[index][blockIndex]);
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
  };

  hs.checkForMatches = function(){

    //start top left
    //seen = two dimensional array of checked
    var grid = hs.buildGrid();
    console.log(grid);
    var seen = [];
    for(var i = 0; i < grid.length; i++){
      seen[i] = [];
      for(var j = 0; j < grid[i].length; j++){
        seen[i][j] = false;
      }
    }


    var count = hs.checkFromIndex(grid, seen, 0, 0);

    console.log("matched " + count);

    if(count > 2){
      $(".checked").css('background-color', 'black');
    }

    console.log(seen);
    console.log(hs.nextUnseen(seen));

  };

  hs.nextUnseen = function(seenArr){
    for(var i = 0; i < seenArr.length; i++ ){
        for(var j = 0; j < seenArr[i].length; j++ ){
          if(seenArr[i][j] === false){
            return {row : i, col : j};
          }
        }
    }
  };

  hs.checkFromIndex = function(grid, seen, row, col, color, count){
    var $currentNode = $(grid[row][col]),
        currentColor = $currentNode.attr("data-color");

        console.log($currentNode);
        console.log("prev color : " + color);
        console.log("node color : " + currentColor);

    if(count == undefined){
      count = 1;
    }

    if(color != undefined){
      if(color == currentColor){
        console.log("match at " + row + " : " + col);
        $currentNode.addClass("checked");
        count++;
      }else{
        console.log("no match");
        return 0;
      }
    }else{
      color = currentColor;
      $currentNode.addClass("checked");
    }

    seen[row][col] = true;

    console.log("now checking row " + row + " and col " + col);

    if(seen[row-1] && seen[row-1][col] === false){
      //checktop
      console.log('check top');
      count += hs.checkFromIndex(grid, seen, row - 1, col, color, count);
    }

    if(seen[row][col - 1] === false){
      //check left
      console.log('check left');
      count += hs.checkFromIndex(grid, seen, row, col - 1, color, count);
    }

    if(seen[row][col + 1] === false){
        //check right
      count +=   hs.checkFromIndex(grid, seen, row, col + 1, color);
        console.log('check right');
    }
    if(seen[row + 1] && seen[row + 1][col] === false){
      //check bottom
      count += hs.checkFromIndex(grid, seen, row + 1, col, color, count);

      console.log('check bottom');

    }
    return count;

  };

  hs.buildGrid = function(){
    return $('li').map(function(){
      return $(this).children('.block');
    });
  };

  hs.fillInRows = function(){
    /*
    * starting with bottom row, if any cells are empty
    * fill them with the color above and empty that cell
    * if the cell above is empty, don't do anything
    * we'll catch it on the next go-round
    */
    $("li").reverse().each(function(rowIndex){
      console.log('rowIndex : ' + rowIndex);
      var actualIndex = NUM_CELLS_PER_ROW - rowIndex - 1;
      console.log('actualIndex : ' + actualIndex);


      $(this)
      .children("div.block")
      .each(function(blockIndex){
        if($(this).attr('data-color') == null){
          console.log('cell at ' + blockIndex + ' in row ' + actualIndex + ' is blank');
          if(actualIndex == 0){
            var newColor = getRandomColor();
            hs.colorCell($(this), newColor);
          }else{
              hs.combine(hs.getCell(actualIndex - 1, blockIndex), $(this));
          }
        }
      })
    });

  };

  hs.getDarker = function(hex){
    return ColorLuminance(hex, -.4);
  };

  hs.colorCell = function($cell, color){
    $cell
    .removeClass(all_color_classes)
    .addClass(color.name)
    .css('border-color', hs.getDarker(color.hue))
    .attr('data-color', color.name);
  };

  hs.getCell = function(rowIndex, cellIndex){
    return $("li").eq(rowIndex).children('div.block').eq(cellIndex);
  };

  hs.anyCellsAreEmpty = function(){
    return false;
  };

  hs.handleClick = function(){
    if(!firstSelected){
        $("div.block").removeClass('first');
        $(this).addClass('first');
        firstSelected = true;
    }else{
      var $first = $("div.block.first"),
          $second = $(this);


      var areContig = hs.areBlocksContiguous($first, $second),
          areEqual = $first.get(0) == $second.get(0);

      console.log("are contig : " + areContig);
      console.log("are equal : " + areEqual);

      if(areContig){
        hs.combine($first, $second);
        hs.fillInRows();
      }else if(areEqual){
        $("div.block").removeClass('first');
        firstSelected = false;
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
    var fromColor = $from.attr('data-color'),
        toColor = $to.attr('data-color');

    console.log('combining ' + fromColor + ' to ' + toColor);
    if(fromColor == null){

    }else if(toColor == null){
        var fromColorObject = colors[fromColor];

        hs.colorCell($to, fromColorObject);

        hs.colorCell($from, emptyColor);

        $("div.block").removeClass('first');
        firstSelected = false;

    }else{
      var fromColorObject = colors[fromColor],
          toColorObject = colors[toColor];

      if(_.has(fromColorObject.combinations, toColor)){
        console.log('we can match');

        var changeTo = colors[fromColorObject.combinations[toColor]];

        hs.colorCell($to, changeTo);

        hs.colorCell($from, emptyColor);


        $("div.block").removeClass('first');
        firstSelected = false;

      }else {
        console.warn('we cannot combine');
      }
    }

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
  hs.checkForMatches();
});
