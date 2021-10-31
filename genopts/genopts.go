package main

import (
	"flag"
	"log"
)

var (
	optsType = flag.String("opts_type", "", "The name of the primary options type")
	implType = flag.String("impl_type", "", "The name of the implementation type; if empty this is derived from --opts_type")
)

func genOpts() error {

	return nil
}

func main() {
	flag.Parse()
	if err := genOpts(); err != nil {
		log.Fatalf("genOpts: %v", err)
	}
}
