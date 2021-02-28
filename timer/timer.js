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
  this.render();
};

Controller.prototype.render = function() {
  if (this.state_ == State.PAUSED) {
    $('#toggle-btn').text('Resume');
    $('#state').text('paused');
  } else if (this.state_ == State.READY) {
    $('#toggle-btn').text('Start');
    $('#state').text('ready');
  } else if (this.state_ == State.RUNNING) {
    $('#toggle-btn').text('Pause');
    $('#state').html('running');
  }
  let secs = this.millisLeft_ / 1000;
  let pad = function(n) {
    return n<10 ? ('0' + n) : String(n);
  }
  let formatTime = function(secs) {
    let neg = secs<0;
    secs = Math.abs(secs);
    let hours   = Math.floor(secs / 3600);
    let mins = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = secs - (hours * 3600) - (mins * 60);
    let time = [mins, pad(seconds)].join(':');
    if (neg) {
      time = '-' + time;
    }
    return time;
  };
  $('#small').text(formatTime(secs));
  let mins = Math.floor(this.millisLeft_ / 1000 / 60);
  if (this.millisLeft_ > 0) {
    $('#text').text('left');
  } else {
    $('#text').text('over');
  }
  if (this.state_ == State.RUNNING) {
    $('#mins').text('<' + mins);
  } else if (mins >= 0 && secs%60 != 0) {
    $('#mins').text('<' + (mins + 1));
  } else {
    $('#mins').text(mins);
  }
  if (secs >= 0) {
    let percentRemaining = 100*this.millisLeft_ / (1000*this.durationSecs_);
    $('#progress-remaining').css('width', percentRemaining + '%');
    if (secs <= this.warningAtSecs_) {
      $('#container').removeClass('running');
      $('#container').removeClass('negative');
      $('#container').addClass('warning');
    } else {
      $('#container').removeClass('warning');
      $('#container').removeClass('negative');
      $('#container').addClass('running');
    }
  } else {
    $('#container').removeClass('warning');
    $('#container').removeClass('running');
    $('#container').addClass('negative');
    $('#percent-remaining').css('width', '0%');
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
