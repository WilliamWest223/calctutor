#!/usr/bin/env python3
"""Calctutor's local server.

Identical to `python3 -m http.server` except it sends Cache-Control: no-store.
The stock server sends no cache headers at all, which lets browsers hold on to
stale ES modules — so an edit appears not to take effect until a hard refresh.
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


http.server.ThreadingHTTPServer.request_queue_size = 128

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        # quiet by default; only surface 4xx/5xx
        try:
            code = str(args[1])
        except (IndexError, TypeError):
            code = ''
        if code.startswith(('4', '5')):
            sys.stderr.write('%s %s\n' % (self.address_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8142
    try:
        http.server.ThreadingHTTPServer(('', port), Handler).serve_forever()
    except KeyboardInterrupt:
        print()
    except OSError as e:
        sys.exit('Could not bind port %d: %s' % (port, e))


if __name__ == '__main__':
    main()
