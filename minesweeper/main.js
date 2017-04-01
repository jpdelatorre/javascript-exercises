//start time: 20:30
//end time: 22:49

var Minesweeper = {
  mines_locations: {},
  mines_count: 10,
  flags_count: 10,
  cell_count: 64,
  board_size: 8,
  board_element: 0,

  init: function(element_id, board_size, total_mines) {
    this.flags_count = this.mines_count = total_mines;
    this.board_element = element_id;
    this.board_size = board_size;
    this.drawBoard(this.board_element, this.board_size);
  },

  plantMines: function() {
    var arr = [];

    while (arr.length < this.mines_count) {
      var randomnumber = Math.ceil(Math.random() * this.cell_count);
      var found = false;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == randomnumber) {
          found = true;
          break;
        }
      }

      if (!found) arr[arr.length] = randomnumber;
    }

    this.mines_locations = arr;
  },

  drawBoard: function(element_id, board_size) {
    var board = '<table border="1">';
    var total_cells = 0;

    for (i = 0; i < board_size; i++) {
      board = board + '<tr>';
      for (j = 0; j < board_size; j++) {
        total_cells++;
        var cell_id = 'cell-' + total_cells;
        board = board +
          '<td style="width:30px; height:30px; text-align:center;"><a class="cell" href="#" id="' +
          cell_id +
          '"><span>' +
          total_cells +
          '</span></a></td>';
      }
      board = board + '</tr>';
    }

    this.cell_count = total_cells;
    this.plantMines();

    $('#' + element_id).html(board);
    $('table').on('click', 'a.cell', function() {
      Minesweeper.checkCell(this.id);
      return false;
    });
    $('table').on('contextmenu', 'a.cell', function(el) {
      if (this.flags_count > 0) {
        $(el.target).parent().text('🚩');
        this.flags_count--;
      } else {
        alert('Out of flags');
      }

      return false;
    }.bind(this))
  },
  hasMine: function(cell_number) {
    return ~this.mines_locations.indexOf(cell_number) ? 1 : 0;
  },
  checkCell: function(cell_id, neighbor_check) {
    var cell_number = parseInt(cell_id.substr(5));

    if (this.hasMine(cell_number) == 1) {
      $('#' + cell_id).parent().text('💣💥');
      $('#' + this.board_element).append('<div class="game-over"><span>Game Over</span></div>');
      console.log('Game Over');
      return 0;
    }

    var neighbor_mines = 0;
    neighbor_mines += this.hasMine(this.getTopNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getLeftNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getRightNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getBottomNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getTopLeftNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getTopRightNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getBottomLeftNeighbor(cell_number));
    neighbor_mines += this.hasMine(this.getBottomRightNeighbor(cell_number));

    $('#' + cell_id).parent().text(neighbor_mines);

    if (neighbor_mines === 0 && !neighbor_check) {
      this.openNeighbors(cell_number);
    }
  },
  getTopNeighbor: function(cell_number) {
    if (cell_number >= this.board_size) {
      return cell_number - this.board_size;
    }

    return 0;
  },
  getLeftNeighbor: function(cell_number) {
    var cell = cell_number - 1;

    if (cell != 0 && cell_number % this.board_size != 1) {
      return cell;
    }

    return 0;
  },
  getRightNeighbor: function(cell_number) {
    var cell = cell_number + 1;

    if (cell <= this.cell_count && cell_number % this.board_size != 0) {
      return cell;
    }

    return 0;
  },
  getBottomNeighbor: function(cell_number) {
    if (cell_number <= 0) return 0;
    var cell = cell_number + this.board_size;

    if (cell <= this.cell_count) {
      return cell;
    }

    return 0;
  },
  getTopLeftNeighbor: function(cell_number) {
    return this.getTopNeighbor(this.getLeftNeighbor(cell_number));
  },
  getTopRightNeighbor: function(cell_number) {
    return this.getTopNeighbor(this.getRightNeighbor(cell_number));
  },
  getBottomLeftNeighbor: function(cell_number) {
    return this.getBottomNeighbor(this.getLeftNeighbor(cell_number));
  },
  getBottomRightNeighbor: function(cell_number) {
    return this.getBottomNeighbor(this.getRightNeighbor(cell_number));
  },
  openNeighbors: function(cell_number) {
    this.checkCell('cell-' + this.getTopNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getLeftNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getRightNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getBottomNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getTopLeftNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getTopRightNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getBottomLeftNeighbor(cell_number), true);
    this.checkCell('cell-' + this.getBottomRightNeighbor(cell_number), true);
  },
};
