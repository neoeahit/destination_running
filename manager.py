import tornado.web, tornado.ioloop
from tornado import gen
import motor
from tornado.options import parse_command_line, define, options
import json
import time

define("port", default=9001)
define("debug", default=True)

if __name__ == "__main__":
    db = motor.MotorClient().test
    handlers = [
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static", "default_filename": "index.html"})
    ]

    application = tornado.web.Application(
        handlers,
        debug=options.debug,
        db=db
    )
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
