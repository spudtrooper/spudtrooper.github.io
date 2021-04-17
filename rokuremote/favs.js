function initFavs() {
  let favs = [
    'YouTube TV',
    'HBO Max',
    'Netflix',
    'Hulu',
    'YouTube',
  ];
  let params = new URLSearchParams(location.search);
  let addr;
  if (params.get('url')) {
    addr = params.get('url') + ':8060';
  } else if (params.get('addr')) {
    addr = params.get('addr');
  } else {
    addr = '192.168.1.53:8060';
  }
  let r = new Roku(addr);
  for (let i=0; i < favs.length; i++) {
    let app = findAppByName(favs[i]);
    let icon = 'http://' + addr + '/query/icon/' + app.id;
    let div = $('<span>');
    $('#container').append(div);
    let link = $('<a>').attr('href', '#');
    $(link).click(function() {
      let id = app.id;
      let name = app.name;
      return function() {
        r.send('/launch/' + id);
        if (name == 'YouTube') {
          setTimeout(function() {
            r.send('/keypress/Select');
          }, 3000);
        }
      }
    }());
    $(div).append(link);
    let img = $('<img>').attr('src', icon);
    $(link).append(img);
  }
}
