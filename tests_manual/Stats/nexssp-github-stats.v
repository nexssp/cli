
// @author Marcin Polak mapoart@gmail.com
// Try to run it also with Nexss Programmer
// 04 May 2021
// V 0.2.2 b3890e2

import net.http
import json

const (
	base_url='https://api.npmjs.org/downloads/point/'
)

fn make_user_url(start string, end string, user string) string {
	return '$base_url$start:$end/$user'
}

fn task(pkg string, start string, end string, user string) ?string {
	url1 := make_user_url(start, end, user)

	println('Task for: $url1/$pkg')
	if resp := http.get('$url1/$pkg') {
		return resp.text
	} else {
		return err
	}
}

struct Package {
	package string
	downloads int
}

fn main() {
	// Example url: https://api.npmjs.org/downloads/point/2021-01-01:2021-05-01/@nexssp/cli	
	start:= '2020-04-27'
	end:='2036-05-03'
	user:='@nexssp'

	packages:=[
		// --- Cli tools and libraries
		'cli',
		'os',
		'test',
		// ---
		'command',
		'config',
		'file',
		'ensure',
		'cache',
		'language',
		'min',
		'package',
		'project',
		// --- Libraries
		'ansi'
		'const',
		'data',
		'dddebug',
		'expression-parser',
		'extend',
		'logdebug',
		'packunpack',
		'plugin',
		'stack',
		'system',
	]

	mut threads := []thread ?string {}
	for package in packages {
		println('starting: $package')
		threads << go task(package, start, end, user)
	}

	mut res := []Package{len: threads.len}
	for i, t in threads {
		// t.wait() or { res[i] = i }
		res_json_string := t.wait() or { "not received" }

		y := json.decode(Package, res_json_string) or {
			assert false
			Package{}
		}

		res[i] = y
	}

	println( res)
}
