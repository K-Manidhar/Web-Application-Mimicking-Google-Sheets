$(document).ready(function () {
  const rows = 20;
  const cols = 10;

  // Create the spreadsheet grid
  createSpreadsheet(rows, cols);

  // Handle cell input
  $('#spreadsheet').on('input', '.cell[contenteditable="true"]', function () {
      const value = $(this).text();
      const row = $(this).data('row');
      const col = $(this).data('col');
      console.log(`Cell [${row},${col}] updated to: ${value}`);
  });

  // Handle cell selection
  let isMouseDown = false;
  let startCell = null;

  $('#spreadsheet').on('mousedown', '.cell[contenteditable="true"]', function (e) {
      isMouseDown = true;
      startCell = this;
      $(this).addClass('selected');
      $(this).focus(); // Ensure the cell is focused for typing
      e.preventDefault(); // Prevent text selection
  });

  $('#spreadsheet').on('mouseover', '.cell[contenteditable="true"]', function (e) {
      if (isMouseDown) {
          selectRange(startCell, this);
      }
  });

  $(document).on('mouseup', function () {
      isMouseDown = false;
  });
});

// Create the spreadsheet grid with headers
function createSpreadsheet(rows, cols) {
  const spreadsheet = $('#spreadsheet');

  // Add column headers (A, B, C, ...)
  spreadsheet.append($('<div>').addClass('cell header')); // Empty corner cell
  for (let j = 0; j < cols; j++) {
      const colHeader = $('<div>')
          .addClass('cell header')
          .text(String.fromCharCode(65 + j)); // A, B, C, ...
      spreadsheet.append(colHeader);
  }

  // Add rows with row numbers and cells
  for (let i = 0; i < rows; i++) {
      // Row number
      const rowHeader = $('<div>')
          .addClass('cell header')
          .text(i + 1);
      spreadsheet.append(rowHeader);

      // Cells in the row
      for (let j = 0; j < cols; j++) {
          const cell = $('<div>')
              .addClass('cell')
              .attr('contenteditable', true)
              .attr('data-row', i)
              .attr('data-col', j)
              .attr('data-name', `${String.fromCharCode(65 + j)}${i + 1}`); // A1, B2, etc.
          spreadsheet.append(cell);
      }
  }
}

// Select a range of cells
function selectRange(startCell, endCell) {
  const startRow = parseInt($(startCell).data('row'));
  const startCol = parseInt($(startCell).data('col'));
  const endRow = parseInt($(endCell).data('row'));
  const endCol = parseInt($(endCell).data('col'));

  // Clear previous selection
  $('.cell.selected').removeClass('selected');

  // Select cells in the range
  for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
      for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
          $(`.cell[data-row="${i}"][data-col="${j}"]`).addClass('selected');
      }
  }
}

// Apply mathematical functions and show the result in a pop-up
function applyFunction(func) {
  const selectedCells = $('.cell.selected');
  if (!selectedCells.length) return;

  let result;
  switch (func) {
      case 'SUM':
          result = selectedCells.toArray().reduce((acc, cell) => acc + parseFloat(cell.textContent || 0), 0);
          break;
      case 'AVERAGE':
          result = selectedCells.toArray().reduce((acc, cell) => acc + parseFloat(cell.textContent || 0), 0) / selectedCells.length;
          break;
      case 'MAX':
          result = Math.max(...selectedCells.toArray().map(cell => parseFloat(cell.textContent || -Infinity)));
          break;
      case 'MIN':
          result = Math.min(...selectedCells.toArray().map(cell => parseFloat(cell.textContent || Infinity)));
          break;
      case 'COUNT':
          result = selectedCells.length;
          break;
  }

  if (result !== undefined) {
      alert(`${func} result: ${result}`); // Show result in a pop-up
  }
}
