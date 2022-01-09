function isFake() {
    return String(document.location).indexOf('fake') != -1;
}

function updateAOCLink() {
    let day = $('#days').val();
    let url = 'https://adventofcode.com/2021/day/' + day;
    $('#aoc-link').attr('href', url).text('Link to day ' + day);
}

function main() {
    $('#days').change(fill);

    let butterMsg, butterCls, butterLink;
    if (isFake()) {
        butterMsg = 'This is fake data. To use real data, remove "?fake" from the URL';
        butterCls = 'fake'
        butterLink = String(document.location).replace(/[\?#].*/g, '')
    } else {
        butterMsg = 'This is real data. You may hit quota issues. If so add "?fake" to the URL';
        butterCls = 'real'
        butterLink = String(document.location).replace(/[?#].*/g, '') + '?fake'
    }
    console.log('butterLink', butterLink);
    $('#butter').html(butterMsg);
    $('#butter').addClass(butterCls);
    $('#butter-link').attr('href', butterLink)

    for (let i = 1; i <= 25; i++) {
        let opt = $('<option>').val(i).text('Day ' + i);
        $('#days').append(opt);
    }
    $('#days').change(updateAOCLink);
    $('#days option[value=1]').attr('selected', 'selected');
    updateAOCLink();

    configs.forEach((cfg, i) => {
        let user = cfg.user;
        let leftNav = $('#left > .nav');
        {
            let li = $('<li>').addClass('nav-item');
            let a = $('<a>').addClass('nav-link');
            a.text(user);
            a.attr('href', '#');
            $(li).append(a);
            $(leftNav).append(li);
            $(a).click(() => {
                $('#left > .nav > .nav-item > .nav-link').removeClass('active');
                $(a).addClass('active');
                fillUser(user, 'left');
            });
            if (i == 0) {
                $(a).addClass('active');
            }
        }

        let rightNav = $('#right > .nav');
        {
            let li = $('<li>').addClass('nav-item');
            let a = $('<a>').addClass('nav-link');
            a.text(user);
            a.attr('href', '#');
            $(li).append(a);
            $(rightNav).append(li);
            $(a).click(() => {
                $('#right > .nav > .nav-item > .nav-link').removeClass('active');
                $(a).addClass('active');
                fillUser(user, 'right');
            });
            if (i == 1) {
                $(a).addClass('active');
            }
        }

        let div = $('#' + cfg.username);
        let lab = $('<div>').addClass('label');
        lab.text(cfg.username);
        $(div).append(lab);
        let link = $('<a>').addClass('link').attr('target', '_');
        $(div).append(link);
        let code = $('<pre>').addClass('code');
        $(div).append(code);
    });

    fill();
}

function pad(x) {
    return x < 10 ? '0' + x : String(x);
}

let configs = [
    {
        user: 'cshabsin',
        repo: 'advent',
        branch: 'master',
        path: function (day) {
            return '2021/' + day + '/day' + day + '.go';
        },
        fake: 'cGFja2FnZSBtYWluCgppbXBvcnQgKAoJImZtdCIKCSJsb2ciCgoJImdpdGh1\nYi5jb20vY3NoYWJzaW4vYWR2ZW50L2NvbW1vbmdlbi9yZWFkaW5wIgopCgpm\ndW5jIG1haW4oKSB7CglmaXJzdFNhbXBsZSwgZXJyIDo9IHBhcnNlKCJhY2Vk\nZ2ZiIGNkZmJlIGdjZGZhIGZiY2FkIGRhYiBjZWZhYmQgY2RmZ2ViIGVhZmIg\nY2FnZWRiIGFiIHwgY2RmZWIgZmNhZGIgY2RmZWIgY2RiYWYiKQoJaWYgZXJy\nICE9IG5pbCB7CgkJbG9nLkZhdGFsKGVycikKCX0KCWZpcnN0U2FtcGxlLmdl\ndE1hcHBpbmcoKQoKCWRheThhKCJzYW1wbGUudHh0IikKCWRheThiKCJzYW1w\nbGUudHh0IikKCWZtdC5QcmludGxuKCItLS0iKQoJZGF5OGEoImlucHV0LnR4\ndCIpCglkYXk4YigiaW5wdXQudHh0IikKfQoKZnVuYyBkYXk4YShmbiBzdHJp\nbmcpIHsKCWNoLCBlcnIgOj0gcmVhZGlucC5SZWFkKGZuLCBwYXJzZSkKCWlm\nIGVyciAhPSBuaWwgewoJCWxvZy5GYXRhbChlcnIpCgl9Cgl2YXIgY250IGlu\ndAoJZm9yIGxpbmUgOj0gcmFuZ2UgY2ggewoJCW91dCwgZXJyIDo9IGxpbmUu\nR2V0KCkKCQlpZiBlcnIgIT0gbmlsIHsKCQkJbG9nLkZhdGFsKGVycikKCQl9\nCgkJZm9yIF8sIG8gOj0gcmFuZ2Ugb3V0Lm91dHB1dCB7CgkJCWlmIGxlbihv\nKSA9PSAyIHx8IGxlbihvKSA9PSA0IHx8IGxlbihvKSA9PSAzIHx8IGxlbihv\nKSA9PSA3IHsKCQkJCWNudCsrCgkJCX0KCQl9Cgl9CglmbXQuUHJpbnRsbihj\nbnQpCn0KCmZ1bmMgZGF5OGIoZm4gc3RyaW5nKSB7CgljaCwgZXJyIDo9IHJl\nYWRpbnAuUmVhZChmbiwgcGFyc2UpCglpZiBlcnIgIT0gbmlsIHsKCQlsb2cu\nRmF0YWwoZXJyKQoJfQoJdmFyIGNudCBpbnQKCWZvciBsaW5lIDo9IHJhbmdl\nIGNoIHsKCQlvdXQsIGVyciA6PSBsaW5lLkdldCgpCgkJaWYgZXJyICE9IG5p\nbCB7CgkJCWxvZy5GYXRhbChlcnIpCgkJfQoJCW1hcHBpbmcgOj0gb3V0Lmdl\ndE1hcHBpbmcoKQoJCXZhciB0b3QgaW50CgkJZm9yIF8sIG91dFZhbCA6PSBy\nYW5nZSBvdXQub3V0cHV0IHsKCQkJaWYgb3V0VmFsID09ICIiIHsKCQkJCWNv\nbnRpbnVlCgkJCX0KCQkJdG90ID0gMTAqdG90ICsgbWFwcGluZy50cmFuc2xh\ndGUob3V0VmFsKQoJCX0KCQlmbXQuUHJpbnRsbihvdXQubGluZSwgdG90KQoJ\nCWNudCArPSB0b3QKCX0KCWZtdC5QcmludGxuKGNudCkKfQo=\n',
    },
    {
        user: 'monkeynova',
        repo: 'advent-of-code',
        branch: 'main',
        path: function (day) {
            return 'advent_of_code/2021/day' + pad(day) + '/day' + pad(day) + '.cc';
        },
        fake: 'I2luY2x1ZGUgImFkdmVudF9vZl9jb2RlLzIwMjEvZGF5MDkvZGF5MDkuaCIK\nCiNpbmNsdWRlICJhYnNsL2FsZ29yaXRobS9jb250YWluZXIuaCIKI2luY2x1\nZGUgImFic2wvY29udGFpbmVyL2ZsYXRfaGFzaF9tYXAuaCIKI2luY2x1ZGUg\nImFic2wvY29udGFpbmVyL2ZsYXRfaGFzaF9zZXQuaCIKI2luY2x1ZGUgImFi\nc2wvc3RyaW5ncy9udW1iZXJzLmgiCiNpbmNsdWRlICJhYnNsL3N0cmluZ3Mv\nc3RyX2NhdC5oIgojaW5jbHVkZSAiYWJzbC9zdHJpbmdzL3N0cl9qb2luLmgi\nCiNpbmNsdWRlICJhYnNsL3N0cmluZ3Mvc3RyX3NwbGl0LmgiCiNpbmNsdWRl\nICJhZHZlbnRfb2ZfY29kZS9jaGFyX2JvYXJkLmgiCiNpbmNsdWRlICJhZHZl\nbnRfb2ZfY29kZS9wb2ludC5oIgojaW5jbHVkZSAiZ2xvZy9sb2dnaW5nLmgi\nCiNpbmNsdWRlICJyZTIvcmUyLmgiCgpuYW1lc3BhY2UgYWR2ZW50X29mX2Nv\nZGUgewoKbmFtZXNwYWNlIHsKCnN0ZDo6dmVjdG9yPFBvaW50PiBGaW5kTG93\nKGNvbnN0IENoYXJCb2FyZCYgYm9hcmQpIHsKICBzdGQ6OnZlY3RvcjxQb2lu\ndD4gcmV0OwogIGZvciAoUG9pbnQgcCA6IGJvYXJkLnJhbmdlKCkpIHsKICAg\nIGJvb2wgbG93ID0gdHJ1ZTsKICAgIGZvciAoUG9pbnQgZCA6IENhcmRpbmFs\nOjprRm91ckRpcnMpIHsKICAgICAgUG9pbnQgcDIgPSBwICsgZDsKICAgICAg\naWYgKCFib2FyZC5PbkJvYXJkKHAyKSkgY29udGludWU7CiAgICAgIGlmIChi\nb2FyZFtwXSA+PSBib2FyZFtwMl0pIHsKICAgICAgICBsb3cgPSBmYWxzZTsK\nICAgICAgICBicmVhazsKICAgICAgfQogICAgfQogICAgaWYgKGxvdykgewog\nICAgICByZXQucHVzaF9iYWNrKHApOwogICAgfQogIH0KICByZXR1cm4gcmV0\nOwp9CgppbnQ2NF90IEJhc2luU2l6ZShjb25zdCBDaGFyQm9hcmQmIGJvYXJk\nLCBQb2ludCBwKSB7CiAgYWJzbDo6ZmxhdF9oYXNoX3NldDxQb2ludD4gaGlz\ndG9yeSA9IHtwfTsKICBmb3IgKHN0ZDo6ZGVxdWU8UG9pbnQ+IGZyb250aWVy\nID0ge3B9OyAhZnJvbnRpZXIuZW1wdHkoKTsgZnJvbnRpZXIucG9wX2Zyb250\nKCkpIHsKICAgIFBvaW50IGN1ciA9IGZyb250aWVyLmZyb250KCk7CiAgICBm\nb3IgKFBvaW50IGQgOiBDYXJkaW5hbDo6a0ZvdXJEaXJzKSB7CiAgICAgIFBv\naW50IG4gPSBjdXIgKyBkOwogICAgICBpZiAoIWJvYXJkLk9uQm9hcmQobikp\nIGNvbnRpbnVlOwogICAgICBpZiAoYm9hcmRbbl0gPT0gJzknKSBjb250aW51\nZTsKICAgICAgaWYgKGhpc3RvcnkuY29udGFpbnMobikpIGNvbnRpbnVlOwog\nICAgICBoaXN0b3J5Lmluc2VydChuKTsKICAgICAgZnJvbnRpZXIucHVzaF9i\nYWNrKG4pOwogICAgfQogIH0KICByZXR1cm4gaGlzdG9yeS5zaXplKCk7Cn0K\nCgp9ICAvLyBuYW1lc3BhY2UKCmFic2w6OlN0YXR1c09yPHN0ZDo6c3RyaW5n\nPiBEYXlfMjAyMV8wOTo6UGFydDEoCiAgICBhYnNsOjpTcGFuPGFic2w6OnN0\ncmluZ192aWV3PiBpbnB1dCkgY29uc3QgewogIGFic2w6OlN0YXR1c09yPENo\nYXJCb2FyZD4gYm9hcmQgPSBDaGFyQm9hcmQ6OlBhcnNlKGlucHV0KTsKICBp\nZiAoIWJvYXJkLm9rKCkpIHJldHVybiBib2FyZC5zdGF0dXMoKTsKCiAgc3Rk\nOjp2ZWN0b3I8UG9pbnQ+IGJhc2lucyA9IEZpbmRMb3coKmJvYXJkKTsKICBp\nbnQ2NF90IHN1bV9yaXNrID0gMDsKICBmb3IgKFBvaW50IHAgOiBiYXNpbnMp\nIHsKICAgIHN1bV9yaXNrICs9ICgqYm9hcmQpW3BdICsgMSAtICcwJzsKICB9\nCgogIHJldHVybiBJbnRSZXR1cm4oc3VtX3Jpc2spOwp9CgphYnNsOjpTdGF0\ndXNPcjxzdGQ6OnN0cmluZz4gRGF5XzIwMjFfMDk6OlBhcnQyKAogICAgYWJz\nbDo6U3BhbjxhYnNsOjpzdHJpbmdfdmlldz4gaW5wdXQpIGNvbnN0IHsKICBh\nYnNsOjpTdGF0dXNPcjxDaGFyQm9hcmQ+IGJvYXJkID0gQ2hhckJvYXJkOjpQ\nYXJzZShpbnB1dCk7CiAgaWYgKCFib2FyZC5vaygpKSByZXR1cm4gYm9hcmQu\nc3RhdHVzKCk7CgogIHN0ZDo6dmVjdG9yPFBvaW50PiBiYXNpbnMgPSBGaW5k\nTG93KCpib2FyZCk7CiAgaWYgKGJhc2lucy5zaXplKCkgPCAzKSByZXR1cm4g\nRXJyb3IoIk5vdCBlbm91Z2ggYmFzaW5zIik7CgogIHN0ZDo6dmVjdG9yPGlu\ndDY0X3Q+IHNpemVzOwogIGZvciAoUG9pbnQgc3RhcnQgOiBiYXNpbnMpIHsK\nICAgIHNpemVzLnB1c2hfYmFjayhCYXNpblNpemUoKmJvYXJkLCBzdGFydCkp\nOwogIH0KICBhYnNsOjpjX3NvcnQoc2l6ZXMpOwogIGFic2w6OmNfcmV2ZXJz\nZShzaXplcyk7CgogIHJldHVybiBJbnRSZXR1cm4oc2l6ZXNbMF0gKiBzaXpl\nc1sxXSAqIHNpemVzWzJdKTsKfQoKfSAgLy8gbmFtZXNwYWNlIGFkdmVudF9v\nZl9jb2RlCg==\n',
    },
    {
        user: 'davidmargolin',
        repo: 'Advent-Of-Code',
        branch: '2021',
        path: function (day) {
            return '' + day + '/index.js';
        },
        fake: 'aW1wb3J0IGZzIGZyb20gImZzIjsKCi8vIHBhcnNlIGlucHV0Cgpjb25zdCB0\nZXh0ID0gZnMucmVhZEZpbGVTeW5jKCIuLzkvaW5wdXQudHh0IiwgeyBlbmNv\nZGluZzogInV0Zi04IiB9KTsKY29uc3QgdGV4dEJ5TGluZSA9IHRleHQuc3Bs\naXQoIlxuIik7CgovLyBQYXJ0IDEKCmNvbnNvbGUubG9nKCJQYXJ0IDE6Iik7\nCgpjb25zdCBncmlkID0gdGV4dEJ5TGluZS5tYXAobGluZSA9PiBsaW5lLnNw\nbGl0KCIiKS5tYXAobiA9PiBwYXJzZUludChuKSkpOwoKY29uc3QgZGlyZWN0\naW9ucyA9IFtbMCwgMV0sIFsxLCAwXSwgWzAsIC0xXSwgWy0xLCAwXV07Cgpm\ndW5jdGlvbiBpc0xvd1BvaW50KHgsIHkpIHsKICAgIGNvbnN0IGN1cnJlbnQg\nPSBncmlkW3ldW3hdOwogICAgY29uc3QgbmVpZ2hib3JzID0gZGlyZWN0aW9u\ncy5tYXAoKFt4RGVsdGEsIHlEZWx0YV0pID0+IHsKICAgICAgICBjb25zdCBu\nZXdZID0geSArIHlEZWx0YTsKICAgICAgICBjb25zdCBuZXdYID0geCArIHhE\nZWx0YTsKICAgICAgICBpZiAobmV3WSA+PSAwICYmIG5ld1kgPCBncmlkLmxl\nbmd0aCAmJiBuZXdYID49IDAgJiYgbmV3WCA8IGdyaWRbMF0ubGVuZ3RoKSB7\nCiAgICAgICAgICAgIHJldHVybiBncmlkW25ld1ldW25ld1hdOwogICAgICAg\nIH0KICAgICAgICByZXR1cm4gSW5maW5pdHk7CiAgICB9KTsKICAgIHJldHVy\nbiBjdXJyZW50IDwgTWF0aC5taW4oLi4ubmVpZ2hib3JzKTsKfQoKbGV0IGNv\ndW50ID0gMDsKZm9yIChsZXQgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSsr\nKSB7CiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGdyaWRbMF0ubGVuZ3RoOyB4\nKyspIHsKICAgICAgICBpZiAoaXNMb3dQb2ludCh4LCB5KSkgY291bnQgKz0g\nZ3JpZFt5XVt4XSArIDE7CiAgICB9Cn0KCmNvbnNvbGUubG9nKGNvdW50KTsK\nCi8vIFBhcnQgMgoKY29uc29sZS5sb2coIlBhcnQgMjoiKTsKCmZ1bmN0aW9u\nIGNsb3NlTmVhcmVzdEJhc2lucyh4LCB5KSB7CiAgICBpZiAoZ3JpZFt5XVt4\nXSA9PSA5KSByZXR1cm4gMDsKICAgIGdyaWRbeV1beF0gPSA5OwogICAgY29u\nc3QgbmVhcmJ5QmFzaW5TaXplcyA9IGRpcmVjdGlvbnMubWFwKChbeERlbHRh\nLCB5RGVsdGFdKSA9PiB7CiAgICAgICAgY29uc3QgbmV3WSA9IHkgKyB5RGVs\ndGE7CiAgICAgICAgY29uc3QgbmV3WCA9IHggKyB4RGVsdGE7CiAgICAgICAg\naWYgKG5ld1kgPj0gMCAmJiBuZXdZIDwgZ3JpZC5sZW5ndGggJiYgbmV3WCA+\nPSAwICYmIG5ld1ggPCBncmlkWzBdLmxlbmd0aCkgewogICAgICAgICAgICBy\nZXR1cm4gY2xvc2VOZWFyZXN0QmFzaW5zKG5ld1gsIG5ld1kpOwogICAgICAg\nIH0KICAgICAgICByZXR1cm4gMDsKICAgIH0pLnJlZHVjZSgoYSwgYikgPT4g\nYSArIGIpOwogICAgcmV0dXJuIDEgKyBuZWFyYnlCYXNpblNpemVzOwp9Cgps\nZXQgc2l6ZXMgPSBbXTsKZm9yIChsZXQgeSA9IDA7IHkgPCBncmlkLmxlbmd0\naDsgeSsrKSB7CiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGdyaWRbMF0ubGVu\nZ3RoOyB4KyspIHsKICAgICAgICBjb25zdCBzaXplID0gY2xvc2VOZWFyZXN0\nQmFzaW5zKHgsIHkpOwogICAgICAgIGlmIChzaXplcy5sZW5ndGggPCAzIHx8\nIHNpemUgPiBzaXplc1syXSkgewogICAgICAgICAgICBzaXplcy5wdXNoKHNp\nemUpOwogICAgICAgICAgICBzaXplcyA9IHNpemVzLnNvcnQoKGEsIGIpID0+\nIGIgLSBhKS5zbGljZSgwLCAzKTsKICAgICAgICB9CiAgICB9Cn0KCmNvbnNv\nbGUubG9nKHNpemVzLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIpKTs=\n',
    },
    {
        user: 'spudtrooper',
        repo: 'adventofcode',
        branch: 'main',
        path: function (day) {
            return '2021/day' + pad(day) + '/lib/lib.go';
        },
        fake: 'cGFja2FnZSBkYXkwOQoKaW1wb3J0ICgKCSJsb2ciCgkic29ydCIKCgkiZ2l0\naHViLmNvbS9zcHVkdHJvb3Blci9hZHZlbnRvZmNvZGUvY29tbW9uL211c3Qi\nCikKCnR5cGUgaGVpZ2h0bWFwIFtdcm93CnR5cGUgcm93IFtdaW50CgpmdW5j\nIChoIGhlaWdodG1hcCkgRGltcygpICh3aWR0aCBpbnQsIGhlaWdodCBpbnQp\nIHsKCWhlaWdodCwgd2lkdGggPSBsZW4oaCksIGxlbihoWzBdKQoJcmV0dXJu\nCn0KCmZ1bmMgKGggaGVpZ2h0bWFwKSBBZGooeCwgeSwgb3IgaW50KSAobGVm\ndCwgcmlnaHQsIHRvcCwgYm90dG9tIGludCkgewoJd2lkdGgsIGhlaWdodCA6\nPSBoLkRpbXMoKQoJbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tID0gb3IsIG9y\nLCBvciwgb3IKCWlmIHggPiAwIHsKCQlsZWZ0ID0gaFt5XVt4LTFdCgl9Cglp\nZiB4IDwgd2lkdGgtMSB7CgkJcmlnaHQgPSBoW3ldW3grMV0KCX0KCWlmIHkg\nPiAwIHsKCQl0b3AgPSBoW3ktMV1beF0KCX0KCWlmIHkgPCBoZWlnaHQtMSB7\nCgkJYm90dG9tID0gaFt5KzFdW3hdCgl9CglyZXR1cm4KfQoKZnVuYyAoaCBo\nZWlnaHRtYXApIExvd1BvaW50cyhmIGZ1bmMoeCwgeSBpbnQpKSB7Cglpc0xv\nd1BvaW50IDo9IGZ1bmModiwgeCwgeSBpbnQpIGJvb2wgewoJCWxlZnQsIHJp\nZ2h0LCB0b3AsIGJvdHRvbSA6PSBoLkFkaih4LCB5LCAxMCkKCQlyZXR1cm4g\ndiA8IGxlZnQgJiYgdiA8IHJpZ2h0ICYmIHYgPCB0b3AgJiYgdiA8IGJvdHRv\nbQoJfQoKCWZvciB5LCByb3cgOj0gcmFuZ2UgaCB7CgkJZm9yIHgsIHYgOj0g\ncmFuZ2Ugcm93IHsKCQkJaWYgaXNMb3dQb2ludCh2LCB4LCB5KSB7CgkJCQlm\nKHgsIHkpCgkJCX0KCQl9Cgl9Cn0KCmZ1bmMgUGFydDEoaW5wdXQgc3RyaW5n\nKSBpbnQgewoJdmFyIGggaGVpZ2h0bWFwCglmb3IgXywgbGluZSA6PSByYW5n\nZSBtdXN0LlJlYWRTdHJpbmdzKGlucHV0KSB7CgkJcm93IDo9IG11c3QuU3Bs\naXRJbnRzKGxpbmUsICIiKQoJCWggPSBhcHBlbmQoaCwgcm93KQoJfQoKCXZh\nciByZXMgaW50CgloLkxvd1BvaW50cyhmdW5jKHgsIHkgaW50KSB7CgkJcmVz\nICs9IDEgKyBoW3ldW3hdCgl9KQoKCXJldHVybiByZXMKfQoKdHlwZSBwb2lu\ndFNldCBtYXBbaW50XWJvb2wKCmZ1bmMgcG9pbnRIYXNoKGggaGVpZ2h0bWFw\nLCB4LCB5IGludCkgaW50IHsKCXdpZHRoLCBfIDo9IGguRGltcygpCglyZXR1\ncm4geSp3aWR0aCArIHgKfQoKZnVuYyBmaW5kQmFzaW4oaCBoZWlnaHRtYXAs\nIHgsIHkgaW50LCBiYXNpbiBwb2ludFNldCkgewoJaGFzaCA6PSBwb2ludEhh\nc2goaCwgeCwgeSkKCWlmIF8sIHNlYXJjaGVkIDo9IGJhc2luW2hhc2hdOyBz\nZWFyY2hlZCB7CgkJcmV0dXJuCgl9CgoJdiA6PSBoW3ldW3hdCglsZWZ0LCBy\naWdodCwgdG9wLCBib3R0b20gOj0gaC5BZGooeCwgeSwgLTEpCgoJaWYgbGVm\ndCA+IHYgewoJCWZpbmRCYXNpbihoLCB4LTEsIHksIGJhc2luKQoJfQoJaWYg\ncmlnaHQgPiB2IHsKCQlmaW5kQmFzaW4oaCwgeCsxLCB5LCBiYXNpbikKCX0K\nCWlmIHRvcCA+IHYgewoJCWZpbmRCYXNpbihoLCB4LCB5LTEsIGJhc2luKQoJ\nfQoJaWYgYm90dG9tID4gdiB7CgkJZmluZEJhc2luKGgsIHgsIHkrMSwgYmFz\naW4pCgl9CgoJaWYgdiAhPSA5IHsKCQliYXNpbltoYXNoXSA9IHRydWUKCX0K\nfQoKZnVuYyBQYXJ0MihpbnB1dCBzdHJpbmcpIGludCB7Cgl2YXIgaCBoZWln\naHRtYXAKCWZvciBfLCBsaW5lIDo9IHJhbmdlIG11c3QuUmVhZFN0cmluZ3Mo\naW5wdXQpIHsKCQlyb3cgOj0gbXVzdC5TcGxpdEludHMobGluZSwgIiIpCgkJ\naCA9IGFwcGVuZChoLCByb3cpCgl9CgoJdmFyIGJhc2luU2l6ZXMgW11pbnQK\nCWguTG93UG9pbnRzKGZ1bmMoeCwgeSBpbnQpIHsKCQliYXNpbiA6PSBwb2lu\ndFNldHt9CgkJZmluZEJhc2luKGgsIHgsIHksIGJhc2luKQoJCWJhc2luU2l6\nZXMgPSBhcHBlbmQoYmFzaW5TaXplcywgbGVuKGJhc2luKSkKCX0pCgoJc29y\ndC5Tb3J0KHNvcnQuUmV2ZXJzZShzb3J0LkludFNsaWNlKGJhc2luU2l6ZXMp\nKSkKCWxvZy5QcmludGYoImJhc2luU2l6ZXM6ICV2IiwgYmFzaW5TaXplcykK\nCXJldHVybiBiYXNpblNpemVzWzBdICogYmFzaW5TaXplc1sxXSAqIGJhc2lu\nU2l6ZXNbMl0KfQo=\n',
    },
];

function fillUser(user, side) {
    let day = $('#days').val();
    let cfg = configs.filter((c) => c.user == user)[0];
    let code = $('#' + side + ' .code');
    let repo = cfg.repo;
    let path = cfg.path(day);
    let url = 'https://api.github.com/repos/' + user + '/' + repo + '/contents/' + path;
    let link = $('#' + side + ' .link');
    let linkUrl = 'https://github.com/' + user + '/' + repo + '/blob/' + cfg.branch + '/' + path;
    link.text(linkUrl);
    link.attr('href', linkUrl);
    let allLink = $('#' + side + ' .all-link');
    let dir = path.replace(/\/[^\/]+$/, '');
    let pathParts = path.split('/');
    let dirText = pathParts.filter((_, i) => i > 0 && i <= pathParts.length - 2).join('/');
    let allLinkUrl = 'https://github.com/' + user + '/' + repo + '/blob/' + cfg.branch + '/' + dir;
    allLink.text(dirText);
    allLink.attr('href', allLinkUrl);
    if (isFake()) {
        $(code).text(atob(cfg.fake));
        hljs.highlightElement($(code)[0]);

    } else {
        $.get(url, function (data) {
            $(code).text(atob(data.content));
            hljs.highlightElement($(code)[0]);
        });
    }
}

function fill() {
    let left = $('#left > .nav > .nav-item > .nav-link.active')[0].innerText;
    fillUser(left, 'left');
    let right = $('#right > .nav > .nav-item > .nav-link.active')[0].innerText;
    fillUser(right, 'right');
}