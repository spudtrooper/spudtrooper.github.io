# gettr.com followers

[gettr.com](http://gettr.com) is Jason Miller's new slop bucket. If members have linked twitter accounts, the number of followers displayed is the number of *gettr* followers + the number of *twitter* followers. For example, [Matt Gaetz](https://gettr.com/user/repmattgaetz) has about **280k** (I found 279494) gettr followers and about **1.3M** twitter followers and gettr shows **1.6M**--almost 5x the reality. Suprisingly, this site doesn't accurately represent reality.

To inspect this you can browse a dump of all Gaetz's followers[<sup>1</sup>](#footnote_1):

* All Gaetz's followers with linked twitter accounts ([simple](repmattgaetz_twitter_followers_simple.html) | [fancy](repmattgaetz_twitter_followers.html))
* All Gaetz's followers with descriptions in their bios ([simple](repmattgaetz_desc_simple.html) | [fancy](repmattgaetz_desc.html))
* All Gaetz's followers ([CSV](repmattgaetz.csv))

Even better is [this guy](https://gettr.com/user/mcgreggorholm) who shows **70.1K** followers:

![mcgreggorholm](mcgreggorholm.png)

but actually has **1**:

![mcgreggorholm-followers](mcgreggorholm-followers.png)

The code that does this is here -- the `m` is the gettr followers and `g` is the twitter followers:

![code](gettr-follower-calc.png)

_____________________________
<a name="#footnote_1"><sup>1</sup></a> Created with [github.com/spudtrooper/gettr](https://github.com/spudtrooper/gettr).