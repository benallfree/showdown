const simpleGit = require('simple-git')
const naturalSort = require('javascript-natural-sort')
naturalSort.insensitive = true
;(async () => {
  const git = simpleGit()
  await git.init()
  const branchRes = await git.branch('-l')
  const branches = Object.keys(branchRes.branches)
    .filter((k) => k.startsWith('checkpoint-'))
    .sort(naturalSort)

  for (let i = 1; i < branches.length; i++) {
    const fromBranch = branches[i - 1]
    const toBranch = branches[i]
    await git.checkout(toBranch)
    const memo = `Merging ${fromBranch} -> ${toBranch}`
    console.log(memo)
    await git.mergeFromTo(fromBranch, toBranch, {
      '--squash': true,
      '--no-commit': true,
    })
    await git.commit(memo)
  }
})()
