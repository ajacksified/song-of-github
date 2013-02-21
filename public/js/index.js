// weird thing with MIDI lib. vOv
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

  var n = 0, delay;

  function loadSong(weeks){
    MIDI.loadPlugin({
      instruments: ['acoustic_grand_piano'],
      callback: function() {
        MIDI.programChange(0, 0);
        MIDI.programChange(1, 118);

        for(n; n < weeks.length; n++){
          delay = n;
          playWeek(weeks[n], n);
        }
      }
    });
  }

  var chords = {
    I:   [48, 52, 55, 60, 64, 67, 72],
    ii:  [50, 53, 57, 62, 65, 69, 74],
    iii: [52, 55, 59, 64, 67, 71, 76],
    IV:  [41, 45, 48, 53, 57, 60, 65],
    V:   [43, 47, 50, 55, 59, 62, 67],
    vi:  [45, 48, 52, 57, 60, 64, 69],
    vii: [47, 50, 53, 59, 62, 65, 71]
  };

  var chordMap = ['I', 'ii', 'iii', 'IV', 'vi', 'vii'];

  function playWeek(week, n) {
    var note = 60;
    var sum = week.reduce(function(t, n) { return t + n; }, 0);
    var chord = getChord();
    var arpeggio = week[0] > 0;
    var noteDelay;

        }
      }
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
