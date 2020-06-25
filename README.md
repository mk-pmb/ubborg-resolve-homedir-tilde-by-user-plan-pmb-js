
<!--#echo json="package.json" key="name" underline="=" -->
ubborg-resolve-homedir-tilde-by-user-plan-pmb
=============================================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Resolve paths that start with `~` to be within some planned user&#39;s planned
home directory.
<!--/#echo -->



API
---

This module exports one function:

### resolveHomeDirTildeByUserPlan(spawnCtx, path, defaultUserName)

`path` is your original path string. If it doesn't start with '~',
it's just returned verbatim.

`defaultUserName` is the username to look up in case there's no username
directly following the tilde, i.e. if `path` is just `~` or starts with `~/`.

`spawnCtx` should be your resource's lineage context,
your module's simplified lineage context,
or something else that supports `.getResourcesByTypeName()`.

Returns a promise for the resolved (absolute) path.




Usage
-----

There should be code examples in the sources of `ubborg-planner-pmb`,
just search for this module's name in `import` statements.
(At time of writing, specifically `src/resTypes/xdgDesktopEntry.mjs`.)


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
