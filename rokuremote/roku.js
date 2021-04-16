function Roku(ipAddr) {
  this.ipAddr_ = ipAddr;
  this.init();
}

Roku.prototype.url_ = function(path) {
  return 'http://' + this.ipAddr_ + path;
}

Roku.prototype.init = function() {
  let url = this.url_('/query/apps');
  $.post(url, {}, function (data, status) {

  });
};

Roku.prototype.press = function(endpoint) {
  let url = this.url_(endpoint);
  $.post(url);
};

Roku.prototype.test = function() {
  this.press('keypress/home');
}

function test() {
  let r = new Roku('192.168.1.53:8060');
  r.test();
}
