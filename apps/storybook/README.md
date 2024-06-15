## NameKit React storybook documentation

### Styling with TailwindCSS

In `package.json`, a command called `tailwind` is defined: this command creates an `output.css` file which basically contains Tailwind CSS specs that are used whenever a Tailwind class is referenced! This `output.css` file is imported in `/.storybook/preview.js` and, this way, makes Tailwind specs available throughout the Storybook context. This command is also referenced in the `build` command since it is essential that our Tailwind specs are up to date to the Tailwind version we have imported in the app.
