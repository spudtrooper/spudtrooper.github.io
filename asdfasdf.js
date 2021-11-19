/*
Finds the total number of seconds in public tracks from your soundcloud.

Usage:
  1. Navigate to https://soundcloud.com/you/tracks
  2. Cycle through your tracks and run this on each page.
  3. The total will print out on every run, e.g. 'total seconds 20657'
 */
(function () {
    let soundBadges = document.getElementsByClassName('soundBadge');
    let totalSecs = 0;
    let findSecs = (el) => {
        let totalSecs = 0;
        let dur = el.getElementsByClassName('soundBadge__duration')[0].innerText;
        // Duration: 4 minutes 15 seconds\n4:15
        let firstLine = dur.split('\n')[0];
        // Duration: 4 minutes 15 seconds
        {
            let m = firstLine.match(/Duration:.*(\d+) second/);
            if (m && m.length == 2) {
                let secs = parseInt(m[1]);
                totalSecs += secs;
            }
        }
        {
            let m = firstLine.match(/Duration:.*(\d+) minute/);
            if (m && m.length == 2) {
                let mins = parseInt(m[1]);
                totalSecs += mins * 60;
            }
        }
        return totalSecs;
    };
    Array.from(soundBadges).forEach((el) => {
        let privateEl = el.getElementsByClassName('sc-label-private');
        let isPrivate = !!privateEl.length;
        if (isPrivate) {
            return;
        }
        totalSecs += findSecs(el);
    });
    let el = document.getElementsByClassName('trackManagerPagination__pageMarker')[0];
    let tag = el.innerText.split(' of ')[0];
    let totals = localStorage['total'] ? JSON.parse(localStorage['total']) : {};
    totals[tag] = totalSecs;
    localStorage['total'] = JSON.stringify(totals);

    let secs = 0;
    for (let n in totals) {
        secs += parseInt(totals[n]);
    }
    console.log('total seconds', secs);
})();
