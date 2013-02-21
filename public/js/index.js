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
      // Major(ish) scale
      // notes = [0, 2, 4, 7, 9, 11, 12, 14, 16, 19, 21],
      // Minor(ish)
      notes = [0, 2, 3, 7, 10, 12, 14, 15, 19],
      calendarData = global.calendarData,
      $visualize;

  function organizeData(calendarData){
    var weeks = [],
        column = [],
        i = 0,
        contrib, mapped;

    for(i; i < calendarData.length; i++){
      mapped = 0;
      contrib = calendarData[i][1];

      if(contrib > 0){
        if(contrib < 5){
          mapped = 1;
        }else if(contrib < 10){
          mapped = 2;
        }else if(contrib < 15){
          mapped = 3;
        }else {
          mapped = 4;
        }
      }

      column.push({
        contrib: contrib,
        mapped: mapped
      });

      if(i > 0 && ((i+1) % 7 === 0)){
        weeks.push(column);
        column = [];
      }
    }

    return weeks;
  }

  function updateTDAfter(week, day, time){
    window.setTimeout(function () {
      $visualize.find('tr:eq(' + day + ') > td:eq(' + week + ')').css({ opacity: 0.25 });
    }, time);
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
        days[m].append($('<td class="status' + weeks[n][m].mapped + '"></td>'));
      }
    }
  }

  function loadSong(weeks){
    MIDI.loadPlugin({
      instruments: [ 'acoustic_grand_piano' ],
      callback: function() {
        var n = 0,
            m = 0,
            // Comments are a guide, have a play
            speed = 1.8, // 0.5 - 5
            noteSpread = 0.05, // 0 - 0.5
            rubato = 0.5, // 0 - 4
            weekDelay, dayDelay, note, dayNote, dayRubato, velocity;

        note = MIDI.pianoKeyOffset + (3 + (12 * 3)); // the MIDI note
        velocity = 50; // how hard the note hits

        loader.stop();
        MIDI.programChange(0, 0);
        MIDI.programChange(1, 118);

        for(n; n < weeks.length; n++){
          // play a new week with some rubato!
          weekDelay = (n / speed) + (rubato * Math.random() - rubato);

          for(m = 0; m < weeks[n].length; m++){
            // Figure out some timings
            dayNote = note + notes[weeks[n][m].contrib % notes.length];
            dayRubato = noteSpread * Math.random();
            dayDelay = weekDelay + (speed / 7) + dayRubato;

            // Play it!
            if(weeks[n][m].mapped > 0){
              MIDI.noteOn(0, dayNote, velocity, dayDelay);
            }

            updateTDAfter(n, m, dayDelay * 1000);
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
