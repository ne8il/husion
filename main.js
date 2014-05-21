var hs = {};

jQuery.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};

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

  hs.checkRowsForEmptyCells = function(){
    hs.checkHorizontal();
    hs.checkVertical();

  };

  hs.checkHorizontal = function(){

  };

  hs.checkVertical = function(){

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
    .css('background-color', color.hue)
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

      var areContig = hs.areBlocksContiguous($first, $second);
      console.log("are contig : " + areContig);
      if(areContig){
        hs.combine($first, $second);
        hs.fillInRows();
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
});
