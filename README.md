## Why?

The goal of this project is to provide muscle memory practice for common editor
tasks when working with code. Bring your own editor and try to complete the tasks
as fast as you can. Perhaps you come to think of ways to improve your workflow or
tweak your editor settings?

Maybe this could turn into something useful to perform as a little kata when
getting accustomed to something like a new editor, IDE or keyboard.

## How?

Clone this repo, then install dependencies:

`npm install`

After that you can run `./start.sh` which will start the editor configured with your `$EDITOR` environment variable. If you want
something else or haven't set `$EDITOR` you can do for instance:

`EDITOR=vi ./start.sh`

Note that if you are using an editor that returns to the terminal on launch, you'll have to figure out how to prevent that. For VS Code for instance
you can do:

`EDITOR="code -w" ./start.sh`

Your first task is to find the text "e-s-start" within the `src` folder that will be made available.
From there on you can follow the instructions in the code comments.

When you have completed the instructions, exit your editor. If your edited files match the expectations in `after` you made it and
the time it took to complete the task is appended to `times.txt`.

It's advisable to have prettier configured in your editor somehow and have it auto-format your code e.g. when saving a file. That will eliminate
a lot of trouble by making sure the formatting is consistent with what's expected in `after`.

glhf!

## Credits

The project source code is based on a copy of angelguzmaning's [real world example](https://github.com/angelguzmaning/ts-redux-react-realworld-example-app).
