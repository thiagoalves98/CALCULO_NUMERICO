package main

import (
	"os"
	"log"
	"fmt"
	"strings"

	"github.com/zserge/webview"
)


func main() {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	fullPath := []string{dir, "index.html"}
	htmlPath := strings.Join(fullPath, "/")
	fmt.Println("Loaded file: ", htmlPath)

	w := webview.New(webview.Settings{
		Title: "Numbiosis",
		URL: "file://" + htmlPath,
		Width: 600,
		Height: 900,
		Resizable: false,
		Debug: true,
	})
	defer w.Exit()
	w.Run()
}
