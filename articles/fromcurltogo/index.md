# from curl to go

**Problem**: You want to create a Go API to someone else's website; a couple examples: https://github.com/spudtrooper/gettr & https://github.com/spudtrooper/scplanner.

For a particular RPC, you need to figure out the interface to give this function, so you first need to figure out the request you're going to make, including:

* The path of the URL to request
* The parameters to set on the URL
* The headers of thq request (in particular, the cookies to send)
* The request body

One of way accomplishing this to:

1. Find the request you want in the Chrome dev console
2. Copy it as a *curl* command
3. Paste the curl command into the terminal, and
4. Tinker
  
This works, but (4) can be annoying to iterate and deal with tihngs like URL encoding and potentially big blobs of text.

I've found an easier way to go from curl to Go is to use the binary from https://github.com/spudtrooper/goutil to convert the curl command directly into Go code, with all the bits that you need to edit exposed for easy editing.

So, instead of pasting the curl command into a terminal, paste it into a file (say `curl.txt`). Then, after you've installed `goutil` with `go install https://github.com/spudtrooper/goutil`, run the following:

```bash
goutil CurlImport --curl_file path/to/curl.txt --curl_outfile playground.go
```

then if your curl command was:

```
curl 'https://rumble.com/service.php?name=user.rumbles&included_js_libs=main%2Cweb_services%2Cevents%2Cerror%2Cui_header%2Cui%2Cads-north%2Cevent_handler%2Cui_overlay&included_css_libs=ui_overlay%2Cglobal' \
  -H 'authority: rumble.com' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'dnt: 1' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'accept: */*' \
  -H 'origin: https://rumble.com' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://rumble.com/vwxio1-ep.-1721-whats-going-on-with-the-bio-research-labs-in-ukraine-the-dan-bongi.html?mref=22lbp&mc=56yab' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cookie: _ga=GA1.2.1652448267.1646936898; _gid=GA1.2.1894183238.1646936898; mref=22lbp; __gads=ID=f224e2ff2cc588bc:T=1646965698:S=ALNI_MY5o4321OhQdFW_xtHtMKzuqfcGaQ; PHPSESSID=qdej41fuf1jmapj824vh76ioiage7ifo; mrefc=2' \
  --data-raw 'type=1&id=50918043&vote=1' \
  --compressed
```

The file `playground.go` would contain:

```go
package main

import (
	"flag"
	"fmt"
	"log"
	"net/url"
	"strings"

	"github.com/spudtrooper/goutil/check"
	"github.com/spudtrooper/goutil/request"
)

func main() {
	flag.Parse()
	// Options
	printData := true
	printCookies := true
	printPayload := true

	// Data
	uri := request.MakeURL("https://rumble.com/service.php",
		request.Param{"name", `user.rumbles`},
		request.Param{"included_js_libs", url.QueryEscape(`main,web_services,events,error,ui_header,ui,ads-north,event_handler,ui_overlay`)},
		request.Param{"included_css_libs", url.QueryEscape(`ui_overlay,global`)},
	)
	cookie := [][2]string{
		{"_ga", `GA1.2.1652448267.1646936898`},
		{"_gid", `GA1.2.1894183238.1646936898`},
		{"mref", `22lbp`},
		{"__gads", `ID=f224e2ff2cc588bc:T=1646965698:S=ALNI_MY5o4321OhQdFW_xtHtMKzuqfcGaQ`},
		{"PHPSESSID", `qdej41fuf1jmapj824vh76ioiage7ifo`},
		{"mrefc", `2`},
	}
	headers := map[string]string{
		"authority":          `rumble.com`,
		"pragma":             `no-cache`,
		"cache-control":      `no-cache`,
		"sec-ch-ua":          `" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"`,
		"dnt":                `1`,
		"sec-ch-ua-mobile":   `?0`,
		"user-agent":         `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36`,
		"sec-ch-ua-platform": `"macOS"`,
		"content-type":       `application/x-www-form-urlencoded`,
		"accept":             `*/*`,
		"origin":             `https://rumble.com`,
		"sec-fetch-site":     `same-origin`,
		"sec-fetch-mode":     `cors`,
		"sec-fetch-dest":     `empty`,
		"referer":            `https://rumble.com/vwxio1-ep.-1721-whats-going-on-with-the-bio-research-labs-in-ukraine-the-dan-bongi.html?mref=22lbp&mc=56yab`,
		"accept-language":    `en-US,en;q=0.9`,
	}
	body := request.MakeRequestParams(
		request.Param{"type", 1},
		request.Param{"id", 50918043},
		request.Param{"vote", 1},
	)

	// Make the request
	if len(cookie) > 0 {
		var cs []string
		for _, c := range cookie {
			cs = append(cs, fmt.Sprintf("%s=%s", c[0], c[1]))
		}
		if c := strings.Join(cs, "; "); c != "" {
			headers["cookie"] = c
		}
	}

	var payload interface{}
	var res *request.Response
	var err error
	if body == "" {
		res, err = request.Get(uri, &payload, request.RequestExtraHeaders(headers))
	} else {
		res, err = request.Post(uri, &payload, strings.NewReader(body), request.RequestExtraHeaders(headers))
	}
	if printData {
		log.Printf("data: %s", string(res.Data))
	}
	if printCookies {
		log.Printf("cookies: %v", res.Cookies)
	}
	if printPayload {
		log.Printf("payload: %s", request.MustFormatString(payload))
	}
	check.Err(err)
}
```

You can iterate by modifying `playground.go` (in particular the *Data* section) and running it with `go run playground.go` to see the results.