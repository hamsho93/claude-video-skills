"""Drift check: a working copy of the toolkit (made with `cp -r toolkit ~/mn-toolkit`) falls behind as the repo's toolkit improves,
and a session then runs stale tools without noticing. Run this at the start of a session.
python3 drift.py WORKING_COPY      (this script's own toolkit is the reference)   -> exit code 1 when any tool or kit differs
It compares py/, web/ and TOOLKIT.md, ignoring installed files (.deps, models, caches). To update: copy those three over the
working copy (its .deps and models stay).
"""
import filecmp, os, sys

REF = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def walk(root, sub):
    base = os.path.join(root, sub)
    if os.path.isfile(base):
        return {sub}
    out = set()
    for dp, dn, fn in os.walk(base):
        dn[:] = [x for x in dn if x not in ('__pycache__', '.deps', 'models', 'node_modules')]
        for f in fn:
            if not f.endswith(('.pyc',)):
                out.add(os.path.relpath(os.path.join(dp, f), root))
    return out


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    wc = os.path.abspath(os.path.expanduser(sys.argv[1]))
    diff = []
    for sub in ('py', 'web', 'TOOLKIT.md'):
        a, b = walk(REF, sub), walk(wc, sub)
        diff += [f'only in the repo toolkit: {x}' for x in sorted(a - b)]
        diff += [f'only in the working copy: {x}' for x in sorted(b - a)]
        diff += [f'differs: {x}' for x in sorted(a & b) if not filecmp.cmp(os.path.join(REF, x), os.path.join(wc, x), shallow=False)]
    print('\n'.join(diff) if diff else f'{wc} matches the repo toolkit')
    sys.exit(1 if diff else 0)


if __name__ == '__main__':
    main()
