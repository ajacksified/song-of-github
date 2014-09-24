// weird thing with MIDI lib. vOv
var songOfGitHub = function(global, $, MIDI){
  'use strict';

  var allWeeks = [];
  var mapping = {
        'fill: #eeeeee;': 0,
        'fill: #d6e685;': 1,
        'fill: #8cc665;': 2,
        'fill: #44a340;': 3,
        'fill: #1e6823;': 4
      },
      names = global.names;

  // Returns contributions data parsed from a jQuery element containing `.day`
  // descendants with `data-date` and `data-count` attributes corresponding to a
  // user's contributions.
  //
  // Example return value:
  //
  //     [
  //       ["2014-09-01", 15],
  //       ["2014-09-02", 3],
  //       ...
  //     ]
  function parseSvgData($svgWrapper) {
    return $.map($svgWrapper.find(".day"), function (dayEl) {
      var $dayEl = $(dayEl);
      return [[$dayEl.data("date"), $dayEl.data("count")]];
    });
  }

  function organizeData(calendarData) {
    var weeks = [],
        column = [],
        d = new Date(calendarData[0][0]),
        dayOffset = d.getDay(),
        contrib, i, j, index;

    for(i = 0; i < calendarData.length; i++){
      // offset by day of week; dates sent over don't necessarily start at monday
      if(i == 0){
        for(j = 0; j < dayOffset; j++){
          column.push(0);
          i++;
        }
      }

      contrib = calendarData[i - dayOffset][1];
      column.push(contrib);

      // break on a new week
      if(i > 0 && ((i+1) % 7 === 0)){
        weeks.push(column);
        column = [];
      }
    }

    return weeks;
  }

  function updateTD(week, day, name){
    $('#' + name + ' #visualize').find('tr:eq(' + day + ') > td:eq(' + week + ')').css({ opacity: 0.25 });
  }

  function loadVisualization(weeks, name){
    var days = [
      $('#' + name + ' #day0'),
      $('#' + name + ' #day1'),
      $('#' + name + ' #day2'),
      $('#' + name + ' #day3'),
      $('#' + name + ' #day4'),
      $('#' + name + ' #day5'),
      $('#' + name + ' #day6')
    ],
    n = 0,
    m = 0,
    contrib = 0;

    for(n; n < weeks.length; n++){
      for(m = 0; m < weeks[n].length; m++){

        contrib = weeks[n][m];

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

        days[m].append($('<td class="status' + contrib + '"></td>'));
      }
    }
  }

  var n = 0, i = 0, delay;

  function loadSong(weeks){
    MIDI.loadPlugin({
      soundfontUrl: "./soundfont/",
      instrument: "acoustic_grand_piano",
      callback: function() {
        MIDI.programChange(0, 0);
        MIDI.programChange(1, 118);

        for(n; n < weeks[0].length; n++){
          delay = n;
          for (i in weeks) {
            playWeek(weeks[i][n], n, names[i]);
          }
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

  function playWeek(week, n, name) {
    var note = 60;
    var sum = week.reduce(function(t, n) { return t + n; }, 0);
    var chord = getChord();
    var arpeggio = week[0] > 0;
    var noteDelay;

    for(var m = 0; m < week.length; m++){
      if(week[m] > 0){
        MIDI.noteOn(0, getNote(), getVelocity(), getDelay());
        if (m > 5) {
          MIDI.noteOn(0, getNote(), getVelocity(), getDelay() * 0.5);
        }
      }

      (function(n, m, name){
        window.setTimeout(function(){
          updateTD(n,m,name)
        }, noteDelay * 1000)
      }(n, m,name));
    }

    function getChord() {
      var l = chordMap.length;
      return chords[chordMap[(sum ^ l) % (l - 1)]];
    }

    function getNote() {
      var note = chord[m];
      return (sum % 14 == 0) && (m % 3 == 0) ? note + 1 : note;
    }

    function getVelocity() {
      return 20 + (m * 4);
    }

    function getDelay() {
      if (arpeggio) {
        noteDelay = delay + (m / chordMap.length - 1);
      } else {
       noteDelay = delay;
      }
      return noteDelay;
    }
  };

  function playSong() {
    if (allWeeks.length > 0) {
      loadSong(allWeeks);
    }
    return false;
  };

  function showVisualization() {
    if (allWeeks.length === 0) {
      names.forEach(function(name) {
        var weeks = organizeData(parseSvgData($("#" + name + "-data")));
        loadVisualization(weeks, name);
        allWeeks.push(weeks)
      });
    }
  };

  function buildPlayButton() {
   var playButton = jQuery('<button>&rtrif; Click to play</button>');

    playButton.click(function(e){
      songOfGitHub.playSong();
    });

    playButton.insertAfter('#visualize');
  }

  function init(autoPlay) {
    showVisualization();
    if(autoPlay) {
      playSong();
    } else {
      buildPlayButton();
    }
  };

  return {
    init: init,
    playSong: playSong
  }
}(this, jQuery, MIDI);
