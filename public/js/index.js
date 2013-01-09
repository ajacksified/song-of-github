// weird thing with MIDI lib. vOv
var loader = new widgets.Loader();

!function(global, $, MIDI){
  'use strict';

  var mapping = {
        'fill: #eeeeee;': 0,
        'fill: #d6e685;': 1,
        'fill: #8cc665;': 2,
        'fill: #44a340;': 3,
        'fill: #1e6823;': 4
      },
      calendarData = global.calendarData,
      $visualize;

  function organizeData(calendarData){
    var weeks = [],
        column = [],
        i = 0,
        contrib;

    for(i; i < calendarData.length; i++){
      contrib = calendarData[i][1];

      if(contrib > 0){
        if(contrib < 5){
          contrib = 1;
        }else if(contrib < 10){
          contrib = 2;
        }else if(contrib < 15){
          contrib = 3;
        }else {
          contrib = 4;
        }
      }

      column.push(contrib);

      if(i > 0 && ((i+1) % 7 === 0)){
        weeks.push(column);
        column = [];
      }
    }

    return weeks;
  }

  function updateTD(week, day){
    $visualize.find('tr:eq(' + day + ') > td:eq(' + week + ')').css({ opacity: 0.25 });
  }

  function loadVisualization(weeks){
    var days = [
      $('#day0'),
      $('#day1'),
      $('#day2'),
      $('#day3'),
      $('#day4'),
      $('#day5'),
      $('#day6')
    ],
    n = 0,
    m = 0;

    for(n; n < weeks.length; n++){
      for(m = 0; m < weeks[n].length; m++){
        days[m].append($('<td class="status' + weeks[n][m] + '"></td>'));
      }
    }
  }

  function loadSong(weeks){
    MIDI.loadPlugin({
      instruments: [ 'acoustic_grand_piano' ],
      callback: function() {
        var n = 0,
            m = 0,
            delay, note, velocity;

        loader.stop();
        MIDI.programChange(0, 0);
        MIDI.programChange(1, 118);

        for(n; n < weeks.length; n++){
          delay = n / 4; // play one chord every quarter second
          note = MIDI.pianoKeyOffset + (4 + (12 * 3)) - 1; // the MIDI note
          velocity = 47; // how hard the note hits

          for(m = 0; m < weeks[n].length; m++){
            if(weeks[n][m] > 0){
              MIDI.noteOn(0, note + (weeks[n][m] * 4), velocity, delay + (m / 16));
            }

            (function(n, m){ window.setTimeout(function(){ updateTD(n,m) }, ((delay + (m / 16)) * 1000)) }(n, m));
          }
        }
      }
    });
  }

  $(function(){
    var weeks;

    $visualize = $('#visualize');

    if(calendarData.length > 0){
      weeks = organizeData(calendarData);
      loadVisualization(weeks);
      loadSong(weeks);
    }
  });
}(this, jQuery, MIDI);
