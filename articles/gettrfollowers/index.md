# gettr.com followers

[gettr.com](http://gettr.com) is Jason Miller's new new slop bucket. The number of followers it displays is the number 
of *gettr* followers + the numbetr of *twitter* followers. For example Matt Gaetz has about **280k** gettr followers and about **1.3M** twitter followers and gettr shows **1.6M**. This wasn't intuitive to me.

The code that does this is here -- the `m` is the gettr followers and `g` is the twitter followers:

![code](gettr-follower-calc.png)

To inspect this you can browse a dump of all Gaetz's followers:

*   [repmattgaetz_desc_simple.html](repmattgaetz_desc_simple.html) - All Gaetz's followers as HTML (only includes those that have descriptions to avoid github's file limit of 100MB)
*   [repmattgaetz.csv](repmattgaetz.csv) - All Gaetz's followers as HTML


These were created with [github.com/spudtrooper/gettr](https://github.com/spudtrooper/gettr).