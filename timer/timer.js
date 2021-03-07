State = {
  PAUSED: 'paused',
  READY: 'ready',
  RUNNING: 'RUNNING',
};

Alerts = {
  LARGE: 'large',
  SMALL: 'small',
};

Controller = function() {
  this.state_ = null;
  this.durationSecs_ = 5 * 60;
  this.interval_ = null;
  this.millisLeft_ = 0;
  this.tickMillis_ = 1000;
  this.warningAtSecs_ = 60;
  this.hasIssuedWarning_ = false;
  this.hasIssuedFinished_ = false;
  this.config_ = null;
  this.alertQueue_ = null;
  this.silent_ = false;
};

function playAudio(file) {
  let audio = new Audio(file);
  audio.play(); 
}

Controller.prototype.start = function() {
  let params = new URLSearchParams(document.location.search);
  if (params.get('durationSecs')) {
    this.durationSecs_ = parseInt(params.get('durationSecs'));
  }
  if (params.get('warningAtSecs')) {
    this.warningAtSecs_ = parseInt(params.get('warningAtSecs'));
  }
  if (params.get('tickMillis')) {
    this.tickMillis_ = parseInt(params.get('tickMillis'));
  }
  if (params.get('config')) {
    this.config_ = JSON.parse(params.get('config'));
  }
  if (params.get('silent') != null) {
    this.silent_ = true;
  }
  // Example config:
  // - 10min long
  // - The first 4 for "Reading"
  // - The second 6m for "Discussion"
  if (params.get('r') != null) {
    this.config_ = {
      durationSecs: 10 * 60,
      remaining: [
        {
          minSecs: 6 * 60,
          maxSecs: 10 * 60,
        },
        {
          minSecs: 0 * 60,
          maxSecs: 6 * 60,
        },
      ],
      alerts : [
        2*60,
        6*60,
      ],
      spans: [
        {
          minSecs: 6 * 60,
          maxSecs: 10 * 60,
          message: 'Reading',
          backgroundColor: '#dfbcac',
        },
        {
          minSecs: 2 * 60,
          maxSecs: 6 * 60,
          message: 'Discussion',
          backgroundColor: '#fff',
        },
        {
          minSecs: 0 * 60,
          maxSecs: 2 * 60,
          message: '2 mins',
          backgroundColor: '#F5F749',
        },
        {
          minSecs: -Infinity,
          maxSecs: 0 * 60,
          message: 'Over time', 
          backgroundColor: '#9A031E',
        },        
      ],
    };    
  }
  // Example config: 10min long for "Discussion"  
  if (params.get('d') != null) {
    this.config_ = {
      durationSecs: 10 * 60,
      remaining: [
        {
          minSecs: 0 * 60,
          maxSecs: 10 * 60,
          sound: true,
          noMessage: true,
        },
      ],  
      alerts : [
        2*60,
      ],
      spans: [
        {
          minSecs: 2 * 60,
          maxSecs: 10 * 60,
          message: 'Discussion',
          backgroundColor: '#fff',
        },
        {
          minSecs: 0 * 60,
          maxSecs: 2 * 60,
          message: '2 mins',
          backgroundColor: '#F5F749',
        },
        {
          minSecs: -Infinity,
          maxSecs: 0 * 60,
          message: 'Over time', 
          backgroundColor: '#9A031E',
        },        
      ],
    };    
  }  
  if (this.config_) {
    if (this.config_.durationSecs) {
      this.durationSecs_ = this.config_.durationSecs;
    }
  }
  if (params.get('progressBarHeight')) {
    let progressBarHeight = parseInt(params.get('progressBarHeight'));
    $('.progress-height').css('height', progressBarHeight + 'px');
  }
  this.state_ = State.READY;
  $('#toggle-btn').click(this.toggle.bind(this));
  $('#reset-btn').click(this.reset.bind(this));
  $('body').keyup(function(e){
    console.log('e.keyCode: ' + e.keyCode);
    if (e.keyCode == 32) {
      this.toggle();
    }
    if (e.keyCode == 82) {
      this.reset();
    }
  }.bind(this));
  this.hasIssuedWarning_ = true;
  this.hasIssuedFinished_ = true;
  this.render();
  $('#container').show();
};

Controller.prototype.tick = function() {
  if (this.state_ == State.RUNNING) {
    this.millisLeft_ -= 1000;
  }
  this.render();
  this.maybeAlert();
};

Controller.prototype.maybeAlert = function() {
  if (this.silent_) {
    return;
  }
  let rem = this.millisLeft_ / 1000;
  for (let secs in this.alertQueue_) {
    if (secs >= rem) {
      let alert = this.alertQueue_[secs];
      if (alert == Alerts.SMALL) {
        playAudio('small-bell-ring-01a.mp3');
      } else {
        playAudio('bell-ringing-04.mp3');
      }
      delete this.alertQueue_[secs];
      break;
    }
  }
};

Controller.prototype.reset = function() {
  this.millisLeft_ = this.durationSecs_ * 1000;  
  if (this.state_ != State.RUNNING) {
    if (this.interval_) {
      clearInterval(this.interval_);
    }
    this.state_ = State.READY;    
  }
  this.hasIssuedWarning_ = false;
  this.hasIssuedFinished_ = false;
  this.alertQueue_ = {};
  if (this.config_) {
    if (this.config_.alerts) {
      $(this.config_.alerts).each(function(i, secs) {
        this.alertQueue_[secs] = Alerts.SMALL;
      }.bind(this));
    }
  } else {
    this.alertQueue_[this.warningAtSecs_] = Alerts.SMALL;
  }
  this.alertQueue_[0] = Alerts.LARGE;
  this.render();
};

Controller.prototype.render = function() {
  if (this.state_ == State.PAUSED) {
    $('#toggle-img').removeClass('pause').addClass('play');
    $('#state').text('paused');
  } else if (this.state_ == State.READY) {
    $('#toggle-img').removeClass('pause').addClass('play');
    $('#state').text('ready');
  } else if (this.state_ == State.RUNNING) {
    $('#toggle-img').removeClass('play').addClass('pause');
    $('#state').html('running');
  }
  let secs = this.millisLeft_ / 1000;
  let pad = function(n) {
    let sign = Math.abs(n)<0 ? '-' : '';
    return sign + (Math.abs(n)<10 ? ('0' + n) : n);
  }
  let formatTimeParts = function(secs) {
    let neg = secs<0;
    secs = Math.abs(secs);
    let hours   = Math.floor(secs / 3600);
    let mins = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = secs - (hours * 3600) - (mins * 60);
    return {
      neg: neg,
      mins: mins,
      secs: seconds,
    };
  }
  let formatTime = function(secs) {
    let parts = formatTimeParts(secs);
    let time = [parts.mins, pad(parts.secs)].join(':');
    if (parts.neg) {
      time = '-' + time;
    }
    return time;
  };
  $('#small').text(formatTime(secs));
  let time = formatTimeParts(secs > 0 ? secs + 14 : secs);
  $('#mins').text(time.mins);
  $('#secs').text(pad(Math.floor(time.secs / 15) * 15));
  if (this.config_) {
    if (secs >= 0) {
      let percentRemaining = 100*this.millisLeft_ / (1000*this.durationSecs_);
      $('#progress-remaining').css('width', percentRemaining + '%');
    }
    if (this.config_.spans) {
      for (let i=0; i<this.config_.spans.length; i++) {
        let span = this.config_.spans[i];
        if (span.minSecs < secs && secs <= span.maxSecs) {
          if (span.message) {
            $('#update-msg').text(span.message).show();
          }
          if (span.backgroundColor) {
            $('#container').css('background-color', span.backgroundColor);
          }
          continue;
        }
      }
    }
    if (secs >= 0 && this.config_.remaining) {
      for (let i=0; i<this.config_.remaining.length; i++) {
        let rem = this.config_.remaining[i];
        if (rem.minSecs < secs && secs <= rem.maxSecs && !rem.noMessage) {
          let secsLeft = secs - rem.minSecs        
          let timeLeft = formatTimeParts(secsLeft > 0 ? secsLeft + 14 : secsLeft);
          $('#update-left').html(
            '(<b>' + timeLeft.mins + '</b>m <b>' +
              pad(Math.floor(timeLeft.secs / 15) * 15) + '</b>s)').show();
          continue;
        }
      }
    }
  } else { 
    if (secs >= 0) {
      let percentRemaining = 100*this.millisLeft_ / (1000*this.durationSecs_);
      $('#progress-remaining').css('width', percentRemaining + '%');
      if (secs <= this.warningAtSecs_) {
        $('#container')
          .removeClass('running')
          .removeClass('negative')
          .addClass('warning');
        if (!this.hasIssuedWarning_) {
          this.hasIssuedWarning_ = true;
          $('#update-msg').text('Warning!').fadeIn();
          setTimeout(function() {
            $('#update-msg').fadeOut();
          }, 2000);
        }
      } else {
        $('#container')
          .removeClass('warning')
          .removeClass('negative')
          .addClass('running');
      }
    } else {
      $('#container')
        .removeClass('warning')
        .removeClass('running')
        .addClass('negative');
      $('#percent-remaining').css('width', '0%');
      if (!this.hasIssuedFinished_) {
        this.hasIssuedFinished_ = true;
        $('#update-msg').text('Oh no!').fadeIn();
        setTimeout(function() {
          $('#update-msg').fadeOut();
        }, 2000);
      }
    }
  }
};

Controller.prototype.toggle = function() {
  if (this.interval_) {
    clearInterval(this.interval_);
  }      
  if (this.state_ == State.PAUSED) {
    this.state_ = State.RUNNING;
    this.interval_ = setInterval(this.tick.bind(this), this.tickMillis_);
  } else if (this.state_ == State.READY) {
    this.state_ = State.RUNNING;
    this.millisLeft_ = this.durationSecs_ * 1000;
    this.interval_ = setInterval(this.tick.bind(this), this.tickMillis_);
  } else if (this.state_ == State.RUNNING) {
    this.state_ = State.PAUSED;
  }
  this.render();
};

$(document).ready(() => {
  let c = new Controller();
  window.$controller = c;
  c.start();
  c.reset();
});
