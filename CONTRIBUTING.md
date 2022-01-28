# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1.  Fork and clone the repo
2.  Run `npm install` to install dependencies
3.  Checkout the development branch, which contains the latest changes
4.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

> Tip: Keep your `dev` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend.git
> git fetch upstream
> git branch --set-upstream-to=upstream/dev dev
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `dev` branch
> to use the upstream dev branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `dev` branch. Whenever you
> want to update your version of `dev`, do a regular `git pull`.

## Committing and Pushing changes
We strive to not let our test coverage go down.
If you implement new features please make sure that you have written tests.
Also document code where needed. The format we use is JSDoc.

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]:
  https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
[issues]: https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/issues
