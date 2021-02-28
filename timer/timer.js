State = {
  PAUSED: 'paused',
  READY: 'ready',
  RUNNING: 'RUNNING',
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
};

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
  c.start();
  c.reset();
});
